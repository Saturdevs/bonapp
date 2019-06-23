'use strict'

const CashRegister = require('../models/cashRegister')

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

function deleteCashRegister (req, res) {
  let cashRegisterId = req.params.cashRegisterId

  CashRegister.findById(cashRegisterId, (err, cashRegister) => {
    if (err) return res.status(500).send({ message: `Error al querer borrar la caja: ${err}`})

    cashRegister.remove(err => {
      if (err) return res.status(500).send({ message: `Error al querer borrar la caja: ${err}`})
      res.status(200).send({message: `La caja ha sido eliminada`})
    })
  })
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