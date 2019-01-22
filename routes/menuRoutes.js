'use strict'

const express = require('express')
const menuCtrl = require('../controllers/menu')
const menuRouter = express.Router()

menuRouter.get('/', menuCtrl.getMenus)
menuRouter.get('/:menuId', menuCtrl.getMenu)
menuRouter.get('/hasCategory/:menuId', menuCtrl.hasCategory)
menuRouter.post('/', menuCtrl.saveMenu)
menuRouter.put('/:menuId', menuCtrl.updateMenu)
menuRouter.delete('/:menuId', menuCtrl.deleteMenu)

module.exports = menuRouter