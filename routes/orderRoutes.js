'use strict'

const express = require('express')
const orderCtrl = require('../controllers/order')
const orderRouter = express.Router()

orderRouter.get('/', orderCtrl.getOrders)
orderRouter.get('/lastOrder', orderCtrl.getLastOrder)
orderRouter.get('/:orderId', orderCtrl.getOrder)
orderRouter.get('/:userId', orderCtrl.getOrdersByUser)
orderRouter.get('/status/:table', orderCtrl.getOrderByTableByStatus)
orderRouter.post('/', orderCtrl.saveOrder)
orderRouter.put('/unsettable/:tableNumber', orderCtrl.unSetTable)
orderRouter.put('/:orderId', orderCtrl.updateOrder)
orderRouter.delete('/:orderId', orderCtrl.deleteOrder)

module.exports = orderRouter