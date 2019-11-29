'use strict'

const express = require('express');
const cashRegisterCtrl = require('../controllers/cashRegister');
const cashRegisterRouter = express.Router();
const validators = require('../middlewares/cashRegister/validators');

cashRegisterRouter.get('/', cashRegisterCtrl.getCashRegisters);
cashRegisterRouter.get('/availables', cashRegisterCtrl.getAvailableCashRegisters);
cashRegisterRouter.get('/:cashRegisterId', cashRegisterCtrl.getCashRegister);
cashRegisterRouter.post('/', cashRegisterCtrl.saveCashRegister);
cashRegisterRouter.put('/:cashRegisterId', validators.validateUpdate, cashRegisterCtrl.updateCashRegister);
cashRegisterRouter.delete('/:cashRegisterId', validators.validateDelete, cashRegisterCtrl.deleteCashRegister);

module.exports = cashRegisterRouter;