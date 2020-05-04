'use strict'

const express = require('express');
const arqueoCajaCtrl = require('../controllers/arqueoCaja');
const arqueoCajaRouter = express.Router();
const validators = require('../middlewares/arqueo/validators');
const businessRules = require('../middlewares/arqueo/businessRules');
const authorize = require('../middlewares/auth/authorize');

arqueoCajaRouter.get('/', authorize(), arqueoCajaCtrl.getArqueos);
arqueoCajaRouter.get('/:arqueoId', authorize(), arqueoCajaCtrl.getArqueo);
arqueoCajaRouter.get('/:cashRegisterId/cashRegister/open', authorize(), arqueoCajaCtrl.getArqueoOpenByCashRegister);
arqueoCajaRouter.post('/', authorize(), validators.validateCreate, businessRules.setCashMovementsByDateToCashCount, arqueoCajaCtrl.saveArqueo);
arqueoCajaRouter.put('/:arqueoId', authorize(), arqueoCajaCtrl.updateArqueo);
arqueoCajaRouter.put('/logicalDelete/:arqueoId', authorize(), arqueoCajaCtrl.logicalDeleteArqueo);
arqueoCajaRouter.delete('/:arqueoId', authorize(), arqueoCajaCtrl.deleteArqueo);

module.exports = arqueoCajaRouter;