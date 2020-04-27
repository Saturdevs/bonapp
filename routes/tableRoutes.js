'use strict'

const express = require('express');
const tableCtrl = require('../controllers/table');
const tableRouter = express.Router();
const validators = require('../middlewares/table/validators');
const authorize = require('../middlewares/auth/authorize');

tableRouter.get('/', authorize(), tableCtrl.getTables);
tableRouter.get('/:tableId', authorize(), tableCtrl.getTable);
tableRouter.get('/section/:sectionId', authorize(), tableCtrl.getTablesBySection);
tableRouter.get('/number/:tableNumber', authorize(), tableCtrl.getTableByNumber);
tableRouter.post('/', authorize(), tableCtrl.saveTable);
tableRouter.put('/byNumber/:tableNumber', authorize(), tableCtrl.updateTableByNumber);
tableRouter.put('/unsetanddeletetable/:tableNumber', authorize(), tableCtrl.unSetAndDeleteTable);
tableRouter.put('/:tableId', authorize(), tableCtrl.updateTable);
tableRouter.delete('/:tableId', authorize(), validators.validateDelete, tableCtrl.deleteTableById);

module.exports = tableRouter;