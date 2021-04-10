'use strict'

const express = require('express');
const businessUnitCtrl = require('../controllers/businessUnit');
const businessUnitRouter = express.Router();
const authorize = require('../middlewares/auth/authorize');

businessUnitRouter.get('/byCodes', businessUnitCtrl.getBusinessUnitsByCode);

module.exports = businessUnitRouter;