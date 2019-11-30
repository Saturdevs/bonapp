'use strict'

const PaymentType = require('../../models/paymentType');
const PaymentTypeDAO = require('../../dataAccess/paymentType');
const PaymentTypeService = require('../../services/paymentType');
const HttpStatus = require('http-status-codes');

async function validateDelete(req, res, next) {
  try {
    let paymentTypeId = req.params.paymentTypeId;
    let paymentType = new PaymentType();
    try {
      paymentType = await PaymentTypeDAO.getPaymentTypeById(paymentTypeId);
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: `No se encontró el medio de pago que se desea borrar en la base de datos: ${err}. Intente nuevamente`
      })
    }
    if (paymentType !== null && paymentType !== undefined) {
      let validationErrors = [];

      if (paymentType.default) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: `El medio de pago por defecto no puede ser eliminado.`
        });
      }

      //Si existe alguna transacción que se haya realizado con el medio de pago que se desea eliminar, 
      //la operacion no puede realizarse.
      try {
        let transaction = await PaymentTypeService.getFirstTransactionByPaymentType(paymentTypeId);

        if (transaction !== null && transaction !== undefined) {
          validationErrors.push('Tiene TRANSACCIONES asociadas')
        }
      } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: `Hubo un error al querer eliminar el medio de pago en la validación de transacciones: ${err}`
        })
      }

      //Si existe algun cashFlow con el medio de pago que se quiere eliminar, la operación no puede realizarse
      try {
        let cashFlow = await PaymentTypeService.retrieveOneCashFlowByPaymentType(paymentTypeId);

        if (cashFlow !== null && cashFlow !== undefined) {
          validationErrors.push('Tiene MOVIMIENTOS DE CAJA asociados')
        }
      } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: `Hubo un error al querer eliminar el medio de pago en la validación de movimientos de caja ${err}`
        })
      }

      //Si existe algun pedido con el mismo medio de pago que se quiere eliminar, la operación no puede realizarse
      try {
        let order = await PaymentTypeService.retrieveOneOrderByPaymentType(paymentTypeId);

        if (order !== null && order !== undefined) {
          validationErrors.push('Tiene PEDIDOS asociados')
        }
      } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: `Hubo un error al querer eliminar la caja en la validación de pedidos ${err}`
        })
      }

      if (validationErrors.length === 0) {
        req.paymentType = paymentType;
        next();
      } else {
        let validationError = `Este medio de pago (${paymentType.name}) no puede ser eliminada debido a que:`

        validationErrors.forEach(message => {
          validationError += '\n\r\t- ' + message;
        });

        validationError += '\n\rMárquelo como inactivo en su lugar.'
        return res.status(HttpStatus.CONFLICT).send({ message: validationError })
      }
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `No se encontró el medio de pago que se desea eliminar de la base de datos. Intente nuevamente` })
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateDelete
}