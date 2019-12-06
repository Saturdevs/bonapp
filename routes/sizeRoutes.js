'use strict'

const express = require('express');
const sizeCtrl = require('../controllers/size');
const sizeRouter = express.Router();

sizeRouter.get('/', sizeCtrl.getSizes);
sizeRouter.get('/:sizeId', sizeCtrl.getSize);
sizeRouter.post('/', sizeCtrl.saveSize);
sizeRouter.put('/:sizeId', sizeCtrl.updateSize);
sizeRouter.delete('/:sizeId', sizeCtrl.deleteSize);

module.exports = sizeRouter;