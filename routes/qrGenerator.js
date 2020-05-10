'use strict'

const express = require('express');
const generatorCtrl = require('../controllers/qrGenerator');
const generatorRouter = express.Router();

generatorRouter.post('/', generatorCtrl.generateQRCode);

module.exports = generatorRouter;