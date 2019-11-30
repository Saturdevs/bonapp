'use strict'

const express = require('express');
const paymentTypeCtrl = require('../controllers/paymentType');
const paymentTypeRouter = express.Router();
const validators = require('../middlewares/paymentType/validators');

paymentTypeRouter.get('/', paymentTypeCtrl.getPaymentTypes);
paymentTypeRouter.get('/availables', paymentTypeCtrl.getAvailablePaymentTypes);
paymentTypeRouter.get('/:paymentTypeId', paymentTypeCtrl.getPaymentType);
paymentTypeRouter.post('/', paymentTypeCtrl.savePaymentType);
paymentTypeRouter.put('/:paymentTypeId', paymentTypeCtrl.updatePaymentType);
paymentTypeRouter.delete('/:paymentTypeId', validators.validateDelete, paymentTypeCtrl.deletePaymentType);

module.exports = paymentTypeRouter