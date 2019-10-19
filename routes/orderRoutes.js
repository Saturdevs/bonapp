'use strict'

const express = require('express')
const orderCtrl = require('../controllers/order')
const orderRouter = express.Router()

orderRouter.get('/', orderCtrl.getOrders)
orderRouter.get('/:orderId', orderCtrl.getOrder)
orderRouter.get('/status/:table', orderCtrl.getOrderByTableByStatus)
orderRouter.post('/', orderCtrl.saveOrder)
orderRouter.put('/unsettable/:tableNumber', orderCtrl.unSetTable)
orderRouter.put('/products/', orderCtrl.updateOrderProducts)
orderRouter.put('/products/delete', orderCtrl.deleteProductOrder)
orderRouter.put('/close/:orderId', orderCtrl.closeOrder)
orderRouter.put('/:orderId', orderCtrl.updateOrder)
orderRouter.delete('/:orderId', orderCtrl.deleteOrder)

module.exports = orderRouter