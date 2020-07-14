'use strict'

const express = require('express');
const orderCtrl = require('../controllers/order');
const orderRouter = express.Router();
const authorize = require('../middlewares/auth/authorize');

orderRouter.get('/', authorize(), orderCtrl.getOrders);
orderRouter.get('/:orderId', authorize(), orderCtrl.getOrder);
orderRouter.get('/status/:table', authorize(), orderCtrl.getOrderByTableByStatus);
orderRouter.post('/', authorize(), orderCtrl.saveOrder);
orderRouter.put('/products', authorize(), orderCtrl.updateOrderProducts);
orderRouter.put('/blockUsers', authorize(), orderCtrl.blockUserForPaymentAndValidateAmounts);
orderRouter.put('/products/delete', authorize(), orderCtrl.deleteProductOrder);
orderRouter.put('/close/:orderId', authorize(), orderCtrl.closeOrder);
orderRouter.put('/updateOrder', authorize(), orderCtrl.updateOrder);
orderRouter.put('/:orderId', authorize(), orderCtrl.deleteOrder);
orderRouter.put('/', authorize(), orderCtrl.updatePayments);

module.exports = orderRouter