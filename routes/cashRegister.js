'use strict'

const express = require('express')
const cashRegisterCtrl = require('../controllers/cashRegister')
const cashRegisterRouter = express.Router()

cashRegisterRouter.get('/', cashRegisterCtrl.getCashRegisters)
cashRegisterRouter.get('/default', cashRegisterCtrl.getDefaultCashRegister)
cashRegisterRouter.get('/availables', cashRegisterCtrl.getAvailableCashRegisters)
cashRegisterRouter.get('/:cashRegisterId', cashRegisterCtrl.getCashRegister)
cashRegisterRouter.post('/', cashRegisterCtrl.saveCashRegister)
cashRegisterRouter.put('/unSetDefaultCashRegister/:cashRegisterId', cashRegisterCtrl.unSetDefaultCashRegister)
cashRegisterRouter.put('/:cashRegisterId', cashRegisterCtrl.updateCashRegister)
cashRegisterRouter.delete('/:cashRegisterId', cashRegisterCtrl.deleteCashRegister)

module.exports = cashRegisterRouter