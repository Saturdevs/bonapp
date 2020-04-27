'use strict'

const express = require('express');
const cashFlowCtrl = require('../controllers/cashFlow');
const cashFlowRouter = express.Router();
const authorize = require('../middlewares/auth/authorize');

cashFlowRouter.get('/', authorize(), cashFlowCtrl.getCashFlows);
cashFlowRouter.get('/:cashFlowId', authorize(), cashFlowCtrl.getCashFlow);
cashFlowRouter.post('/', authorize(), cashFlowCtrl.saveCashFlow);
cashFlowRouter.put('/logicalDelete/:cashFlowId', authorize(), cashFlowCtrl.logicalDeleteCashFlow);
cashFlowRouter.delete('/:cashFlowId', authorize(), cashFlowCtrl.deleteCashFlow);

module.exports = cashFlowRouter;