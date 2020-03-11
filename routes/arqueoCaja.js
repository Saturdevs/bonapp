'use strict'

const express = require('express');
const arqueoCajaCtrl = require('../controllers/arqueoCaja');
const arqueoCajaRouter = express.Router();
const validators = require('../middlewares/arqueo/validators');
const businessRules = require('../middlewares/arqueo/businessRules');

arqueoCajaRouter.get('/', arqueoCajaCtrl.getArqueos);
arqueoCajaRouter.get('/:arqueoId', arqueoCajaCtrl.getArqueo);
arqueoCajaRouter.get('/:cashRegisterId/cashRegister/open', arqueoCajaCtrl.getArqueoOpenByCashRegister);
arqueoCajaRouter.post('/', validators.validateCreate, businessRules.setCashMovementsByDateToCashCount, arqueoCajaCtrl.saveArqueo);
arqueoCajaRouter.put('/:arqueoId', arqueoCajaCtrl.updateArqueo);
arqueoCajaRouter.put('/logicalDelete/:arqueoId', arqueoCajaCtrl.logicalDeleteArqueo);
arqueoCajaRouter.delete('/:arqueoId', arqueoCajaCtrl.deleteArqueo);

module.exports = arqueoCajaRouter;