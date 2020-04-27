'use strict'

const express = require('express');
const menuCtrl = require('../controllers/menu');
const menuRouter = express.Router();
const validators = require('../middlewares/menu/validators');
const authorize = require('../middlewares/auth/authorize');

menuRouter.get('/', authorize(), menuCtrl.getMenus);
menuRouter.get('/availables', authorize(), menuCtrl.getMenusAvailables);
menuRouter.get('/:menuId', authorize(), menuCtrl.getMenu);
menuRouter.post('/', authorize(), menuCtrl.saveMenu);
menuRouter.put('/:menuId', authorize(), validators.validateDisable, menuCtrl.updateMenu);
menuRouter.put('/disable/:menuId', authorize(), menuCtrl.disableMenuAndCategoriesAndProducts);
menuRouter.delete('/:menuId', authorize(), validators.validateDelete, menuCtrl.deleteMenu);

module.exports = menuRouter;