'use strict'

const express = require('express');
const paymentTypeCtrl = require('../controllers/paymentType');
const paymentTypeRouter = express.Router();
const validators = require('../middlewares/paymentType/validators');
const authorize = require('../middlewares/auth/authorize');

paymentTypeRouter.get('/', authorize(), paymentTypeCtrl.getPaymentTypes);
paymentTypeRouter.get('/availables', authorize(), paymentTypeCtrl.getAvailablePaymentTypes);
paymentTypeRouter.get('/:paymentTypeId', authorize(), paymentTypeCtrl.getPaymentType);
paymentTypeRouter.post('/', authorize(), paymentTypeCtrl.savePaymentType);
paymentTypeRouter.put('/:paymentTypeId', authorize(), paymentTypeCtrl.updatePaymentType);
paymentTypeRouter.delete('/:paymentTypeId', authorize(), validators.validateDelete, paymentTypeCtrl.deletePaymentType);

module.exports = paymentTypeRouter