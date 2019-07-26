'use strict'

const express = require('express')
const arqueoCajaCtrl = require('../controllers/arqueoCaja')
const arqueoCajaRouter = express.Router()

arqueoCajaRouter.get('/', arqueoCajaCtrl.getArqueos)
arqueoCajaRouter.get('/all', arqueoCajaCtrl.getAll)
arqueoCajaRouter.get('/:arqueoId', arqueoCajaCtrl.getArqueo)   
arqueoCajaRouter.get('/:cashRegisterId/cashRegister', arqueoCajaCtrl.getArqueosByCashRegister)
arqueoCajaRouter.get('/:cashRegisterId/cashRegister/open', arqueoCajaCtrl.getArqueoOpenByCashRegister)
arqueoCajaRouter.get('/:cashRegisterId/cashRegister/last', arqueoCajaCtrl.getLastArqueoByCashRegister)
arqueoCajaRouter.post('/', arqueoCajaCtrl.saveArqueo)
arqueoCajaRouter.put('/:arqueoId', arqueoCajaCtrl.updateArqueo)
arqueoCajaRouter.delete('/:arqueoId', arqueoCajaCtrl.deleteArqueo)

module.exports = arqueoCajaRouter