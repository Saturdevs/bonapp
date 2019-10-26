'use strict'

const express = require('express')
const cashFlowCtrl = require('../controllers/cashFlow')
const cashFlowRouter = express.Router()

cashFlowRouter.get('/', cashFlowCtrl.getCashFlows)
cashFlowRouter.get('/:cashFlowId', cashFlowCtrl.getCashFlow)   
cashFlowRouter.get('/:cashRegisterId/cashRegister', cashFlowCtrl.getCashFlowByCashRegister)
cashFlowRouter.post('/', cashFlowCtrl.saveCashFlow)
cashFlowRouter.delete('/:cashFlowId', cashFlowCtrl.deleteCashFlow)

module.exports = cashFlowRouter