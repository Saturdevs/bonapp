'use strict'

const PaymentType = require('../models/paymentType')
const Client = require('../models/client')
const CashFlow = require('../models/cashFlow')
const Order = require('../models/order')
const CashCount = require('../models/arqueoCaja')

function getPaymentTypes (req, res) {
  PaymentType.find({}, null, {sort: {name: 1}}, (err, paymentTypes) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!paymentTypes) return res.status(404).send({ message: `No existen medios de pagos registrados en la base de datos.`})

    res.status(200).send({ paymentTypes })
  })
}

function getAvailablePaymentTypes (req, res) {
  PaymentType.find({available: true}, null, {sort: {name: 1}}, (err, paymentTypes) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!paymentTypes) return res.status(404).send({ message: `No existen medios de pagos disponibles en la base de datos.`})

    res.status(200).send({ paymentTypes })
  })
}

function getDefaultPaymentType (req, res) {
  PaymentType.find({default: true}, (err, paymentType) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!paymentType) return res.status(404).send({ message: `No existen medios de pagos por default en la base de datos.`})

    res.status(200).send({ paymentType })
  })
}

function getPaymentType (req, res) {
  let paymentTypeId = req.params.paymentTypeId

  PaymentType.findById(paymentTypeId, (err, paymentType) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!paymentType) return res.status(404).send({ message: `El medio de pago ${paymentTypeId} no existe`})

    res.status(200).send({ paymentType }) //Cuando la clave y el valor son iguales
  })
}

function savePaymentType (req, res) {
  console.log('POST /api/paymentType')
  console.log(req.body)

  let paymentType = new PaymentType()
  paymentType.name = req.body.name
  paymentType.available = req.body.available  
  paymentType.default = false
  paymentType.currentAccount = false

  paymentType.save((err, paymentTypeStored) => {
    if(err){
      if(err['code'] == 11000) 
        return res.status(500).send({ message: `Ya existe un medio de pago con ese nombre. Ingrese otro nombre.` })
    }

    res.status(200).send({ paymentType: paymentTypeStored })
  })
}

function updatePaymentType (req, res) {
  let paymentTypeId = req.params.paymentTypeId
  let bodyUpdate = req.body

  PaymentType.findByIdAndUpdate(paymentTypeId, bodyUpdate, (err, paymentTypeUpdated) => {
    if(err){
      if(err['code'] == 11000) 
        return res.status(500).send({ message: `Ya existe un medio de pago con ese nombre. Ingrese otro nombre.` })
    }

    res.status(200).send({ paymentType: paymentTypeUpdated })
  })
}

async function deletePaymentType (req, res) {
  let paymentTypeId = req.params.paymentTypeId

  await PaymentType.findById(paymentTypeId, async (err, paymentType) => {
    if (err) return res.status(500).send({ message: `Error al querer borrar el medio de pago: ${err}`})

    if (paymentType !== 'undefined' && paymentType !== null) {
      let validationMessages = [];
      let validationError;
      validationMessages = await validateDelete(paymentTypeId)
      if (validationMessages.length === 0) {
        paymentType.remove(err => {
          if (err) return res.status(500).send({ message: `Error al querer borrar el medio de pago: ${err}`})
          res.status(200).send({message: `El medio de pago ha sido eliminado`})
        })
      } else {
        validationError = `Este medio de pago (${paymentType.name}) no puede ser eliminado debido a que:`

        validationMessages.forEach(message => {
          validationError += '\n\r\t- ' + message;            
        });

        validationError += '\n\rMárquelo como inactivo en su lugar.'
        return res.status(500).send({ message: validationError})        
      } 
    }    
  })
}

function unSetDefaultPaymentType (req, res) {
  let paymentTypeId = req.params.paymentTypeId
  PaymentType.updateMany({ default: true, _id: {"$ne": paymentTypeId} }, { $set: { default: false }}, (err, raw) => {
    if (err) return handleError(err);
    res.status(200).send({message: `El tipo de pago por defecto ha sido cambiado`})
  });
}

async function validateDelete(paymentMethodId) {

  let validationErrors = [];
  
  await CashFlow.find({paymentType: paymentMethodId}, (err, cashFlows) => {
    if (err) return res.status(500).send({ message: `Hubo un error al querer eliminar el tipo de pago (falló ka validación de movimientos de caja) ${err}`})

    if (cashFlows !== null && cashFlows !== 'undefined' && cashFlows.length > 0) {
      validationErrors.push('Tiene MOVIMIENTOS DE CAJA asociados')
    }
  })
  
  await Client.find({}, (err, clients) => {
    if (err) return res.status(500).send({ message: `Hubo un error al querer eliminar el tipo de pago (falló la validación de transacciones de clientes) ${err}`})

    let foundClient = false;
    for (let i = 0; i < clients.length && !foundClient; i++) {
      for (let j = 0; j < clients[i].transactions.length && !foundClient; j++) {                
        if (clients[i].transactions[j].paymentMethod.toString() === paymentMethodId) {          
          validationErrors.push('Tiene TRANSACCIONES asociadas')
          foundClient = true;
        }
      }
    }
  })  

  await Order.find({}, (err, orders) => {
    if (err) return res.status(500).send({ message: `Hubo un error al querer eliminar el tipo de pago (falló la validación de pedidos) ${err}`})

    let foundOrder = false;
    for (let i = 0; i < orders.length && !foundOrder; i++) {
      for (let j = 0; j < orders[i].users.length && !foundOrder; j++) {
        for (let k = 0; k < orders[i].users[j].payments.length && !foundOrder; k++) {
          if (orders[i].users[j].payments[k].methodId.toString() === paymentMethodId) {
            validationErrors.push('Tiene PEDIDOS asociados')
            foundOrder = true;
          }
        }
      }
    }    
  })

  await CashCount.find({}, (err, cashCounts) => {
    if (err) return res.status(500).send({ message: `Hubo un error al querer eliminar el tipo de pago (falló la validación de arqueos) ${err}`})

    let foundCashCount = false;
    for (let i = 0; i < cashCounts.length && !foundCashCount; i++) {
      for (let j = 0; j < cashCounts[i].realAmount.length && !foundCashCount; j++) {
        if (cashCounts[i].realAmount[j].paymentType.toString() === paymentMethodId) {
          validationErrors.push('Tiene ARQUEOS asociados')
          foundCashCount = true;
        }
      }
    }    
  })

  return validationErrors
}

module.exports = {
  getPaymentType,  
  getPaymentTypes,
  getAvailablePaymentTypes,
  getDefaultPaymentType,
  savePaymentType,
  updatePaymentType,
  deletePaymentType,
  unSetDefaultPaymentType
}