'use strict'

const express = require('express');
const mercadoPagoCtrl = require('../controllers/mercadoPago');
const mercadoPagoRouter = express.Router();

mercadoPagoRouter.post('/', mercadoPagoCtrl.makePayment);
mercadoPagoRouter.post('/customerPayment', mercadoPagoCtrl.makePaymentWithSavedCard);
mercadoPagoRouter.post('/createCustomer', mercadoPagoCtrl.createCustomerAndSaveCard);
mercadoPagoRouter.get('/getCustomer/:email', mercadoPagoCtrl.getCustomer);
mercadoPagoRouter.get('/getCustomerCards/:customerId', mercadoPagoCtrl.getCardsByCustomer);
mercadoPagoRouter.post('/addCard', mercadoPagoCtrl.addCardToCustomer);
module.exports = mercadoPagoRouter;