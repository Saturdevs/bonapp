'use strict'

const CashRegister = require('../models/cashRegister')
const Client = require('../models/client')
const CashFlow = require('../models/cashFlow')
const Order = require('../models/order')
const CashCount = require('../models/arqueoCaja')

function getCashRegisters (req, res) {
  CashRegister.find({}, (err, cashRegisters) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!cashRegisters) return res.status(404).send({ message: `No existen cajas registradas en la base de datos.`})

    res.status(200).send({ cashRegisters })
  })
}

function getAvailableCashRegisters (req, res) {
  CashRegister.find({available: true}, (err, cashRegisters) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!cashRegisters) return res.status(404).send({ message: `No existen cajas habilitadas en la base de datos.`})

    res.status(200).send({ cashRegisters })
  })
}

function getCashRegister (req, res) {
  let cashRegisterId = req.params.cashRegisterId

  CashRegister.findById(cashRegisterId, (err, cashRegister) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!cashRegister) return res.status(404).send({ message: `La caja ${cashRegisterId} no existe`})

    res.status(200).send({ cashRegister })
  })
}

function saveCashRegister (req, res) {
  console.log('POST /api/cashRegister')
  console.log(req.body)

  let cashRegister = new CashRegister()
  cashRegister.name = req.body.name
  cashRegister.available = true
  cashRegister.default = false

  cashRegister.save((err, cashRegisterStored) => {
    if(err){
      if(err['code'] == 11000) 
        return res.status(500).send({ message: `Ya existe una caja con ese nombre. Ingrese otro nombre.` })
    }

    res.status(200).send({ cashRegister: cashRegisterStored })
  })
}

function updateCashRegister (req, res) {
  let cashRegisterId = req.params.cashRegisterId
  let bodyUpdate = req.body

  CashRegister.findByIdAndUpdate(cashRegisterId, bodyUpdate, (err, cashRegisterUpdated) => {
    if(err){
      if(err['code'] == 11000) 
        return res.status(500).send({ message: `Ya existe una caja con ese nombre. Ingrese otro nombre.` })
    }

    res.status(200).send({ cashRegister: cashRegisterUpdated })
  })
}

function unSetDefaultCashRegister (req, res) {
  console.log('unset,back')
  let cashRegisterId = req.params.cashRegisterId
  CashRegister.updateMany({ default: true, _id: {"$ne": cashRegisterId} }, { $set: { default: false }}, (err, raw) => {
    if (err) return handleError(err);
    res.status(200).send({message: `La caja por default ha sido cambiada`})
  });
}

async function deleteCashRegister (req, res) {
  let cashRegisterId = req.params.cashRegisterId

  await CashRegister.findById(cashRegisterId, async (err, cashRegister) => {    
    if (err) return res.status(500).send({ message: `Error al intentar borrar la caja: ${err}`})

    if (cashRegister !== 'undefined' && cashRegister !== null) {
      let validationMessages = [];
      validationMessages = await validateDelete(cashRegisterId)
      if (validationMessages.length === 0) {
        cashRegister.remove(err => {
          if (err) return res.status(500).send({ message: `Error al intentar borrar la caja: ${err}`})
          res.status(200).send({message: `La caja ha sido eliminada`})
        })
      } else {
        return res.status(500).send({ message: validationMessages})        
      } 
    }
  })
}

async function validateDelete(cashRegisterId) {

  let validationErrors = [];
  await Client.find({}, (err, clients) => {
    if (err) return res.status(500).send({ message: `Hubo un error al querer eliminar la caja (validación de transacciones de clientes) ${err}`})

    let found = false;
    for (let i = 0; i < clients.length && !found; i++) {
      for (let j = 0; j < clients[i].transactions.length && !found; j++) {                
        if (clients[i].transactions[j].cashRegister.toString() === cashRegisterId) {          
          validationErrors.push('Tiene TRANSACCIONES asociadas')
          found = true;
        }
      }
    }
  })

  await CashFlow.find({cashRegisterId: cashRegisterId}, (err, cashFlows) => {
    if (err) return res.status(500).send({ message: `Hubo un error al querer eliminar la caja (validación de movimientos de caja) ${err}`})

    if (cashFlows !== null && cashFlows !== 'undefined' && cashFlows.length > 0) {
      validationErrors.push('Tiene MOVIMIENTOS DE CAJA asociados')
    }
  })

  await Order.find({cashRegister: cashRegisterId}, (err, orders) => {
    if (err) return res.status(500).send({ message: `Hubo un error al querer eliminar la caja (validación de pedidos) ${err}`})

    if (orders !== null && orders !== 'undefined' && orders.length > 0) {
      validationErrors.push('Tiene PEDIDOS asociados')
    }
  })

  await CashCount.find({cashRegisterId: cashRegisterId}, (err, cashCounts) => {
    if (err) return res.status(500).send({ message: `Hubo un error al querer eliminar la caja (validación de arqueos) ${err}`})

    if (cashCounts !== null && cashCounts !== 'undefined' && cashCounts.length > 0) {
      validationErrors.push('Tiene ARQUEOS asociados')
    }
  })

  return validationErrors
}

module.exports = {
  getCashRegister,  
  getCashRegisters,
  getAvailableCashRegisters,
  saveCashRegister,
  updateCashRegister,
  unSetDefaultCashRegister,
  deleteCashRegister
}