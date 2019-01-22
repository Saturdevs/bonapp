'use strict'

const express = require('express')
const cashRegisterCtrl = require('../controllers/cashRegister')
const cashRegisterRouter = express.Router()

cashRegisterRouter.get('/', cashRegisterCtrl.getCashRegisters)
cashRegisterRouter.get('/unSetDefaultCashRegister/:cashRegisterId', cashRegisterCtrl.unSetDefaultCashRegister)
cashRegisterRouter.get('/:cashRegisterId', cashRegisterCtrl.getCashRegister)
cashRegisterRouter.post('/', cashRegisterCtrl.saveCashRegister)
cashRegisterRouter.put('/:cashRegisterId', cashRegisterCtrl.updateCashRegister)
cashRegisterRouter.delete('/:cashRegisterId', cashRegisterCtrl.deleteCashRegister)

module.exports = cashRegisterRouter