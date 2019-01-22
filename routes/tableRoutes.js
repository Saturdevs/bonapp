'use strict'

const express = require('express')
const tableCtrl = require('../controllers/table')
const tableRouter = express.Router()

tableRouter.get('/', tableCtrl.getTables)
tableRouter.get('/:tableId', tableCtrl.getTable)
tableRouter.get('/section/:sectionId', tableCtrl.getTableBySection)
tableRouter.get('/number/:tableNumber', tableCtrl.getTableByNumber)
tableRouter.post('/', tableCtrl.saveTable)
tableRouter.put('/:tableId', tableCtrl.updateTable)
tableRouter.delete('/:tableId', tableCtrl.deleteTable)

module.exports = tableRouter