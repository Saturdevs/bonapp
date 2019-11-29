'use strict'

const CashRegisterDAO = require('../../dataAccess/cashRegister');
const CashCountService = require('../../services/arqueoCaja');
const CashRegister = require('../../models/cashRegister');
const TransactionService = require('../../services/transaction');
const CashFlowService = require('../../services/cashFlow');
const OrderService = require('../../services/order');
const HttpStatus = require('http-status-codes');

async function validateUpdate(req, res, next) {
  try {
    let cashRegisterId = req.params.cashRegisterId;
    let available = req.body.available;
    let def = req.body.default;

    let cashRegister = await CashRegisterDAO.getCashRegisterById(cashRegisterId);
    if (cashRegister.default && (!available || !def)) {
      return res.status(HttpStatus.CONFLICT).send({
        message: `La caja registradora por defecto no puede estar inhabilitada o dejar de ser caja por defecto. 
                  Por favor seleccione otra caja como la caja por defecto y vuelva a intentar realizar la actualización.`
      });
    }

    if (!available) {
      let arqueoOpen = await CashCountService.getArqueoOpenByCashRegister(cashRegisterId);

      if (arqueoOpen !== null && arqueoOpen !== undefined) {
        return res.status(HttpStatus.CONFLICT).send({ message: `Esta caja tiene un arqueo abierto y no puede ser marcada como inactiva hasta que el mismo sea cerrado.` });
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

async function validateDelete(req, res, next) {
  try {
    let cashRegisterId = req.params.cashRegisterId;
    let cashRegister = new CashRegister();
    try {
      cashRegister = await CashRegisterDAO.getCashRegisterById(cashRegisterId);
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: `No se encontró la caja que se desea borrar en la base de datos: ${err}. Intente nuevamente`
      })
    }
    if (cashRegister !== null && cashRegister !== undefined) {
      let validationErrors = [];

      if (cashRegister.default) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: `La caja registradora por defecto no puede ser eliminada.`
        });
      }

      //Si existe alguna transacción que se haya realizado en esa caja, esta no puede ser eliminada
      try {
        let transaction = await TransactionService.getFirstTransactionByCashRegister(cashRegisterId);

        if (transaction !== null && transaction !== undefined && transaction.length > 0) {
          validationErrors.push('Tiene TRANSACCIONES asociadas')
        }
      } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: `Hubo un error al querer eliminar la caja en la validación de transacciones: ${err}`
        })
      }

      //Si existe algun cashFlow para la caja registradora que se quiere eliminar, la operación no puede realizarse
      try {
        let cashFlow = await CashFlowService.retrieveOneCashFlowForCashRegister(cashRegisterId);

        if (cashFlow !== null && cashFlow !== undefined) {
          validationErrors.push('Tiene MOVIMIENTOS DE CAJA asociados')
        }
      } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: `Hubo un error al querer eliminar la caja en la validación de movimientos de caja ${err}`
        })
      }

      //Si existe algun cashCount para la caja registradora que se quiere eliminar, la operación no puede realizarse
      try {
        let cashCount = await CashCountService.retrieveOneCashCountForCashRegister(cashRegisterId);

        if (cashCount !== null && cashCount !== undefined) {
          validationErrors.push('Tiene ARQUEOS asociados')
        }
      } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: `Hubo un error al querer eliminar la caja en la validación de arqueos ${err}`
        })
      }

      //Si existe algun pedido para la caja registradora que se quiere eliminar, la operación no puede realizarse
      try {
        let order = await OrderService.retrieveOneOrderForCashRegister(cashRegisterId);

        if (order !== null && order !== undefined) {
          validationErrors.push('Tiene PEDIDOS asociados')
        }
      } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: `Hubo un error al querer eliminar la caja en la validación de pedidos ${err}`
        })
      }

      if (validationErrors.length === 0) {
        req.cashRegister = cashRegister;
        next();
      } else {
        let validationError = `Esta caja (${cashRegister.name}) no puede ser eliminada debido a que:`

        validationErrors.forEach(message => {
          validationError += '\n\r\t- ' + message;
        });

        validationError += '\n\rMárquela como inactiva en su lugar.'
        return res.status(HttpStatus.CONFLICT).send({ message: validationError })
      }
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `No se encontró la caja que se desea borra en la base de datos. Intente nuevamente` })
    }

  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateUpdate,
  validateDelete
}