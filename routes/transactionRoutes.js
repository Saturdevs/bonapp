'use strict'

const express = require('express');
const transactionCtrl = require('../controllers/transaction');
const transactionRouter = express.Router();
const authorize = require('../middlewares/auth/authorize');

transactionRouter.get('/', authorize(), transactionCtrl.getTransactions);
transactionRouter.get('/:transactionId', authorize(), transactionCtrl.getTransaction);
transactionRouter.post('/', authorize(), transactionCtrl.saveTransaction);
transactionRouter.delete('/:transactionId', authorize(), transactionCtrl.deleteTransaction);

module.exports = transactionRouter;