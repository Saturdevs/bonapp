'use strict'

const express = require('express');
const categoryCtrl = require('../controllers/category');
const categoryRouter = express.Router();
const validators = require('../middlewares/category/validators');
const authorize = require('../middlewares/auth/authorize');

categoryRouter.get('/', authorize(), categoryCtrl.getCategories);
categoryRouter.get('/availables', authorize(), categoryCtrl.getCategoriesAvailables);
categoryRouter.get('/:categoryId', authorize(), categoryCtrl.getCategory);
categoryRouter.get('/parent/:menuId', authorize(), categoryCtrl.getCategoryByMenu);
categoryRouter.get('/availables/parent/:menuId', authorize(), categoryCtrl.getCategoriesAvailablesByMenu);
categoryRouter.post('/', authorize(), categoryCtrl.saveCategory);
categoryRouter.put('/:categoryId', authorize(), validators.validateDisable, categoryCtrl.updateCategory);
categoryRouter.put('/disable/:categoryId', authorize(), categoryCtrl.disableCategoryAndProducts);
categoryRouter.delete('/:categoryId', authorize(), validators.validateDelete, categoryCtrl.deleteCategory);

module.exports = categoryRouter;