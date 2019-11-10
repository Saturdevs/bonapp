'use strict'

const CashRegisterService = require('../services/cashRegister');
const HttpStatus = require('http-status-codes');

async function getCashRegisters(req, res) {
  try {
    let cashRegisters = await CashRegisterService.getAll();

    if (cashRegisters !== null && cashRegisters !== undefined) {
      res.status(HttpStatus.OK).send({ cashRegisters });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen cajas registradoras almacenadas en la base de datos.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getAvailableCashRegisters(req, res) {
  try {
    let cashRegisters = await CashRegisterService.getAvailableCashRegisters();

    if (cashRegisters !== null && cashRegisters !== undefined) {
      res.status(HttpStatus.OK).send({ cashRegisters });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen cajas habilitadas.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getCashRegister(req, res) {
  try {
    let cashRegisterId = req.params.cashRegisterId
    let cashRegister = await CashRegisterService.getCashRegister(cashRegisterId);

    if (cashRegister !== null && cashRegister !== undefined) {
      res.status(HttpStatus.OK).send({ cashRegister });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `La caja ${cashRegisterId} no existe en la base de datos.` });
    }
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function saveCashRegister(req, res) {
  try {
    let cashRegisterSaved = await CashRegisterService.saveCashRegister(req.body);

    res.status(HttpStatus.OK).send({ cashRegister: cashRegisterSaved });
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

async function updateCashRegister(req, res) {
  try {
    let cashRegisterId = req.params.cashRegisterId;
    let bodyUpdate = req.body;

    let cashRegisterUpdated = await CashRegisterService.update(cashRegisterId, bodyUpdate);
    res.status(HttpStatus.OK).send({ cashRegister: cashRegisterUpdated });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer actualizar la caja registradora: ${err}.` });
  }
}

async function deleteCashRegister(req, res) {
  let cashRegister = req.cashRegister;

  if (cashRegister === null && cashRegister === undefined) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      message: `No se encontró la caja que se desea borrar en la base de datos. Intente nuevamente`
    })
  }

  try {
    CashRegisterService.removeCashRegister(cashRegister);
    res.status(HttpStatus.OK).send({ message: `La caja ha sido eliminado` });    
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer borrar la caja registradora: ${err}` })        
  }
}

module.exports = {
  getCashRegister,
  getCashRegisters,
  getAvailableCashRegisters,
  saveCashRegister,
  updateCashRegister,
  deleteCashRegister
}