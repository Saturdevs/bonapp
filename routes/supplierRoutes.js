'use strict'

const express = require('express');
const supplierCtrl = require('../controllers/supplier');
const supplierRouter = express.Router();
const authorize = require('../middlewares/auth/authorize');

supplierRouter.get('/', authorize(), supplierCtrl.getSuppliers);
supplierRouter.get('/:supplierId', authorize(), supplierCtrl.getSupplier);
supplierRouter.post('/', authorize(), supplierCtrl.saveSupplier);
supplierRouter.put('/:supplierId', authorize(), supplierCtrl.updateSupplier);
supplierRouter.delete('/:supplierId', authorize(), supplierCtrl.deleteSupplier);

module.exports = supplierRouter;