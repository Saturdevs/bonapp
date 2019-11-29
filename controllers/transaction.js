'use strict'

const TransactionService = require('../services/transaction');
const Transaction = require('../models/transaction');
const HttpStatus = require('http-status-codes');

async function getTransactions(req, res) {
  try {
    let transactions = await TransactionService.getAll();

    if (transactions !== null && transactions !== undefined) {
      res.status(HttpStatus.OK).send({ transactions });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen transacciones registradas en la base de datos.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getTransaction(req, res) {
  try {
    let transactionId = req.params.transactionId;
    let transaction = await TransactionService.getTransaction(transactionId);

    if (transaction !== null && transaction !== undefined) {
      res.status(HttpStatus.OK).send({ transaction });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `La transacción con id ${transactionId} no existe en la base de datos` });
    }
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function saveTransaction(req, res) {
  try {
    let transaction = new Transaction();
    transaction.amount = req.body.amount;
    transaction.paymentMethod = req.body.paymentType;
    transaction.cashRegister = req.body.cashRegister;
    transaction.comment = req.body.comment;
    transaction.deleted = false;
    transaction.client = req.body.client;    

    let transactionSaved = await TransactionService.saveTransaction(transaction);

    res.status(HttpStatus.OK).send({ transaction: transactionSaved });
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

async function deleteTransaction(req, res) {
  try {
    let transactionId = req.params.transactionId;
    TransactionService.deleteTransaction(transactionId);
    res.status(HttpStatus.OK).send({ message: `La transacción ha sido eliminada de la base de datos correctamente.` });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer borrar la transacción de la base de datos: ${err.message}` })
  }
}

module.exports = {
  getTransactions,
  getTransaction,
  saveTransaction,
  deleteTransaction
}