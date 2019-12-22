'use strict'

const express = require('express');
const tableCtrl = require('../controllers/table');
const tableRouter = express.Router();
const validators = require('../middlewares/table/validators');

tableRouter.get('/', tableCtrl.getTables);
tableRouter.get('/:tableId', tableCtrl.getTable);
tableRouter.get('/section/:sectionId', tableCtrl.getTablesBySection);
tableRouter.get('/number/:tableNumber', tableCtrl.getTableByNumber);
tableRouter.post('/', tableCtrl.saveTable);
tableRouter.put('/byNumber/:tableNumber', tableCtrl.updateTableByNumber);
tableRouter.put('/unsetanddeletetable/:tableNumber', tableCtrl.unSetAndDeleteTable);
tableRouter.put('/:tableId', tableCtrl.updateTable);
tableRouter.delete('/:tableId', validators.validateDelete, tableCtrl.deleteTableById);

module.exports = tableRouter;