'use strict'

const express = require('express')
const categoryCtrl = require('../controllers/category')
const categoryRouter = express.Router()

categoryRouter.get('/', categoryCtrl.getCategories)
categoryRouter.get('/:categoryId', categoryCtrl.getCategory)
categoryRouter.get('/parent/:menuId', categoryCtrl.getCategoryByMenu)
categoryRouter.post('/', categoryCtrl.saveCategory)
categoryRouter.put('/:categoryId', categoryCtrl.updateCategory)
categoryRouter.delete('/:categoryId', categoryCtrl.deleteCategory)
categoryRouter.get('/category/withmenu', categoryCtrl.getCategoryWithMenu)

module.exports = categoryRouter