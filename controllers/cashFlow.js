'use strict'

const CashFlow = require('../models/cashFlow')
const CashFlowService = require('../services/cashFlow');
const HttpStatus = require('http-status-codes');

async function getCashFlows (req, res) {
  try {
    let cashFlows = await CashFlowService.getAll();

    if (cashFlows !== null && cashFlows !== undefined) {
      res.status(HttpStatus.OK).send({ cashFlows })
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen movimientos almacenados en la base de datos.`});
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}`})
  }
}

async function getCashFlow (req, res) {
  try {
    let cashFlowId = req.params.cashFlowId;
    let cashFlow = await CashFlowService.getCashFlow(cashFlowId);

    if (cashFlow !== null && cashFlow !== undefined) {
      res.status(HttpStatus.OK).send({ cashFlow })
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `El movimiento ${cashFlowId} no existe`});
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}`})
  }
}

async function saveCashFlow (req, res) {
  try {
    let cashFlow = req.body;
    let cashFlowSaved = await CashFlowService.saveCashFlow(cashFlow);

    res.status(HttpStatus.OK).send({ cashFlow: cashFlowSaved });
  } 
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer guardar el nuevo movimiento en la base de datos: ${err}.` });
  }
}

async function logicalDeleteCashFlow (req, res) {
  try {
    let cashFlowId = req.params.cashFlowId;

    let cashFlowUpdated = await CashFlowService.logicalDelete(cashFlowId);
    res.status(HttpStatus.OK).send({ message: `El moviemiento de caja ha sido eliminado de la base de datos` });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer borrar el moviemiento de caja de la base de datos: ${err}` })    
  }
}

function deleteCashFlow (req, res) {
  try {
    let cashFlowId = req.params.cashFlowId;
    CashFlowService.deleteCashFlow(cashFlowId);
    res.status(HttpStatus.OK).send({ message: `El moviemiento de caja ha sido eliminado de la base de datos` });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer borrar el moviemiento de caja de la base de datos: ${err}` })    
  }
}

module.exports = {
  getCashFlow,  
  getCashFlows,
  saveCashFlow,
  logicalDeleteCashFlow,
  deleteCashFlow
}