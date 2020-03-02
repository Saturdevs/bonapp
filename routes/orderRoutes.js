'use strict'

const express = require('express')
const orderCtrl = require('../controllers/order')
const orderRouter = express.Router()

orderRouter.get('/', orderCtrl.getOrders)
orderRouter.get('/:orderId', orderCtrl.getOrder)
orderRouter.get('/status/:table', orderCtrl.getOrderByTableByStatus)
orderRouter.post('/', orderCtrl.saveOrder)
orderRouter.put('/products', orderCtrl.updateOrderProducts)
orderRouter.put('/blockUsers', orderCtrl.blockUserForPaymentAndValidateAmounts)
orderRouter.put('/products/delete', orderCtrl.deleteProductOrder)
orderRouter.put('/close/:orderId', orderCtrl.closeOrder)
orderRouter.put('/:orderId', orderCtrl.deleteOrder)
orderRouter.put('/', orderCtrl.updatePayments)

module.exports = orderRouter