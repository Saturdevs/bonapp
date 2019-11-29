'use strict'

const express = require('express');
const transactionCtrl = require('../controllers/transaction');
const transactionRouter = express.Router();

transactionRouter.get('/', transactionCtrl.getTransactions);
transactionRouter.get('/:transactionId', transactionCtrl.getTransaction);
transactionRouter.post('/', transactionCtrl.saveTransaction);
transactionRouter.delete('/:transactionId', transactionCtrl.deleteTransaction);

module.exports = transactionRouter;