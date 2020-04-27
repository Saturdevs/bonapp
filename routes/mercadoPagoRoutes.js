'use strict'

const express = require('express');
const mercadoPagoCtrl = require('../controllers/mercadoPago');
const mercadoPagoRouter = express.Router();
const authorize = require('../middlewares/auth/authorize');

mercadoPagoRouter.post('/', authorize(), mercadoPagoCtrl.makePayment);
mercadoPagoRouter.post('/customerPayment', authorize(), mercadoPagoCtrl.makePaymentWithSavedCard);
mercadoPagoRouter.post('/createCustomer', authorize(), mercadoPagoCtrl.createCustomerAndSaveCard);
mercadoPagoRouter.get('/getCustomer/:email', authorize(), mercadoPagoCtrl.getCustomer);
mercadoPagoRouter.get('/getCustomerCards/:customerId', authorize(), mercadoPagoCtrl.getCardsByCustomer);
mercadoPagoRouter.post('/addCard', authorize(), mercadoPagoCtrl.addCardToCustomer);
module.exports = mercadoPagoRouter;