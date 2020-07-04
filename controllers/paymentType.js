'use strict'

const PaymentType = require('../models/paymentType');
const PaymentTypeService = require('../services/paymentType');
const HttpStatus = require('http-status-codes');

async function getPaymentTypes(req, res) {
  try {
    let paymentTypes = await PaymentTypeService.getAll();

    if (paymentTypes !== null && paymentTypes !== undefined) {
      res.status(HttpStatus.OK).send({ paymentTypes: paymentTypes });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen medios de pagos almacenadas en la base de datos.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getAvailablePaymentTypes(req, res) {
  try {
    let paymentTypes = await PaymentTypeService.getAvailablePaymentTypes();

    if (paymentTypes !== null && paymentTypes !== undefined) {
      res.status(HttpStatus.OK).send({ paymentTypes: paymentTypes });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen medios de pagos habilitadas.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getPaymentType(req, res) {
  try {
    let paymentTypeId = req.params.paymentTypeId
    let paymentType = await PaymentTypeService.getPaymentType(paymentTypeId);

    if (paymentType !== null && paymentType !== undefined) {
      res.status(HttpStatus.OK).send({ paymentType });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `El medio de pago ${paymentTypeId} no pudo ser recuperado de la base de datos.` });
    }
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function savePaymentType(req, res) {
  try {
    let paymentType = new PaymentType()
    paymentType.name = req.body.name
    paymentType.available = req.body.available
    paymentType.default = false
    paymentType.currentAccount = false

    let paymentTypeSaved = await PaymentTypeService.savePaymentType(paymentType);

    res.status(HttpStatus.OK).send({ paymentType: paymentTypeSaved });
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

async function updatePaymentType(req, res) {
  try {
    let paymentTypeId = req.params.paymentTypeId;
    let bodyUpdate = req.body;

    let paymentTypeUpdated = await PaymentTypeService.update(paymentTypeId, bodyUpdate);
    res.status(HttpStatus.OK).send({ paymentType: paymentTypeUpdated });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer actualizar el medio de pago: ${err}.` });
  }
}

async function deletePaymentType(req, res) {
  try {
    let paymentType = req.paymentType;
    await PaymentTypeService.deletePaymentType(paymentType);
    res.status(HttpStatus.OK).send({ message: `El medio de pago ha sido eliminado` });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer borrar el medio de pago: ${err}` })
  }
}

module.exports = {
  getPaymentType,
  getPaymentTypes,
  getAvailablePaymentTypes,
  savePaymentType,
  updatePaymentType,
  deletePaymentType
}