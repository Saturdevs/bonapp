'use strict'

const express = require('express');
const sizeCtrl = require('../controllers/size');
const sizeRouter = express.Router();
const authorize = require('../middlewares/auth/authorize');

sizeRouter.get('/', authorize(), sizeCtrl.getSizes);
sizeRouter.get('/:sizeId', authorize(), sizeCtrl.getSize);
sizeRouter.post('/', authorize(), sizeCtrl.saveSize);
sizeRouter.put('/:sizeId', authorize(), sizeCtrl.updateSize);
sizeRouter.delete('/:sizeId', authorize(), sizeCtrl.deleteSize);

module.exports = sizeRouter;