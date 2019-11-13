'use strict'

const express = require('express');
const categoryCtrl = require('../controllers/category');
const categoryRouter = express.Router();
const validators = require('../middlewares/category/validators');

categoryRouter.get('/', categoryCtrl.getCategories);
categoryRouter.get('/:categoryId', categoryCtrl.getCategory);
categoryRouter.get('/parent/:menuId', categoryCtrl.getCategoryByMenu);
categoryRouter.get('/hasOneProduct/:categoryId', categoryCtrl.hasAtLeastOneProduct);
categoryRouter.post('/', categoryCtrl.saveCategory);
categoryRouter.put('/:categoryId', categoryCtrl.updateCategory);
categoryRouter.delete('/:categoryId', validators.validateDelete, categoryCtrl.deleteCategory);

module.exports = categoryRouter;