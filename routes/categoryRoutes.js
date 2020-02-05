'use strict'

const express = require('express');
const categoryCtrl = require('../controllers/category');
const categoryRouter = express.Router();
const validators = require('../middlewares/category/validators');

categoryRouter.get('/', categoryCtrl.getCategories);
categoryRouter.get('/availables', categoryCtrl.getCategoriesAvailables);
categoryRouter.get('/:categoryId', categoryCtrl.getCategory);
categoryRouter.get('/parent/:menuId', categoryCtrl.getCategoryByMenu);
categoryRouter.get('/availables/parent/:menuId', categoryCtrl.getCategoriesAvailablesByMenu);
categoryRouter.get('/hasOneProduct/:categoryId', categoryCtrl.hasAtLeastOneProduct);
categoryRouter.post('/', categoryCtrl.saveCategory);
categoryRouter.put('/:categoryId', validators.validateDisable, categoryCtrl.updateCategory);
categoryRouter.put('/disable/:categoryId', categoryCtrl.disableCategoryAndProducts);
categoryRouter.delete('/:categoryId', validators.validateDelete, categoryCtrl.deleteCategory);

module.exports = categoryRouter;