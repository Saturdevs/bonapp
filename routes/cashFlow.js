'use strict'

const express = require('express');
const cashFlowCtrl = require('../controllers/cashFlow');
const cashFlowRouter = express.Router();

cashFlowRouter.get('/', cashFlowCtrl.getCashFlows);
cashFlowRouter.get('/:cashFlowId', cashFlowCtrl.getCashFlow);
cashFlowRouter.post('/', cashFlowCtrl.saveCashFlow);
cashFlowRouter.put('/logicalDelete/:cashFlowId', cashFlowCtrl.logicalDeleteCashFlow);
cashFlowRouter.delete('/:cashFlowId', cashFlowCtrl.deleteCashFlow);

module.exports = cashFlowRouter;