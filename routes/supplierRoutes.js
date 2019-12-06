'use strict'

const express = require('express');
const supplierCtrl = require('../controllers/supplier');
const supplierRouter = express.Router();

supplierRouter.get('/', supplierCtrl.getSuppliers);
supplierRouter.get('/:supplierId', supplierCtrl.getSupplier);
supplierRouter.post('/', supplierCtrl.saveSupplier);
supplierRouter.put('/:supplierId', supplierCtrl.updateSupplier);
supplierRouter.delete('/:supplierId', supplierCtrl.deleteSupplier);

module.exports = supplierRouter;