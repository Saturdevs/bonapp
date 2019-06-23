'use strict'

const PaymentType = require('../models/paymentType')

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

function deletePaymentType (req, res) {
  let paymentTypeId = req.params.paymentTypeId

  PaymentType.findById(paymentTypeId, (err, paymentType) => {
    if (err) return res.status(500).send({ message: `Error al querer borrar el medio de pago: ${err}`})

    paymentType.remove(err => {
      if (err) return res.status(500).send({ message: `Error al querer borrar el medio de pago: ${err}`})
      res.status(200).send({message: `El medio de pago ha sido eliminado`})
    })
  })
}

function unSetDefaultPaymentType (req, res) {
  let paymentTypeId = req.params.paymentTypeId
  PaymentType.updateMany({ default: true, _id: {"$ne": paymentTypeId} }, { $set: { default: false }}, (err, raw) => {
    if (err) return handleError(err);
    res.status(200).send({message: `El tipo de pago por defecto ha sido cambiado`})
  });
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