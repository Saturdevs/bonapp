'use strict'

const express = require('express');
const cashRegisterCtrl = require('../controllers/cashRegister');
const cashRegisterRouter = express.Router();
const validators = require('../middlewares/cashRegister/validators');
const authorize = require('../middlewares/auth/authorize');

cashRegisterRouter.get('/', authorize(), cashRegisterCtrl.getCashRegisters);
cashRegisterRouter.get('/availables', authorize(), cashRegisterCtrl.getAvailableCashRegisters);
cashRegisterRouter.get('/:cashRegisterId', authorize(), cashRegisterCtrl.getCashRegister);
cashRegisterRouter.post('/', authorize(), cashRegisterCtrl.saveCashRegister);
cashRegisterRouter.put('/:cashRegisterId', authorize(), validators.validateUpdate, cashRegisterCtrl.updateCashRegister);
cashRegisterRouter.delete('/:cashRegisterId', authorize(), validators.validateDelete, cashRegisterCtrl.deleteCashRegister);

module.exports = cashRegisterRouter;