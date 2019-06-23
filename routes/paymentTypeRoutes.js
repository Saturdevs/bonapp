'use strict'

const express = require('express')
const paymentTypeCtrl = require('../controllers/paymentType')
const paymentTypeRouter = express.Router()

paymentTypeRouter.get('/', paymentTypeCtrl.getPaymentTypes)
paymentTypeRouter.get('/availables', paymentTypeCtrl.getAvailablePaymentTypes)
paymentTypeRouter.get('/default', paymentTypeCtrl.getDefaultPaymentType)
paymentTypeRouter.get('/:paymentTypeId', paymentTypeCtrl.getPaymentType)
paymentTypeRouter.post('/', paymentTypeCtrl.savePaymentType)
paymentTypeRouter.put('/unSetDefaultPaymentType/:paymentTypeId', paymentTypeCtrl.unSetDefaultPaymentType)
paymentTypeRouter.put('/:paymentTypeId', paymentTypeCtrl.updatePaymentType)
paymentTypeRouter.delete('/:paymentTypeId', paymentTypeCtrl.deletePaymentType)

module.exports = paymentTypeRouter