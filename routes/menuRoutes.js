'use strict'

const express = require('express');
const menuCtrl = require('../controllers/menu');
const menuRouter = express.Router();
const validators = require('../middlewares/menu/validators');

menuRouter.get('/', menuCtrl.getMenus);
menuRouter.get('/availables', menuCtrl.getMenusAvailables);
menuRouter.get('/:menuId', menuCtrl.getMenu);
menuRouter.post('/', menuCtrl.saveMenu);
menuRouter.put('/:menuId', validators.validateDisable, menuCtrl.updateMenu);
menuRouter.put('/disable/:menuId', menuCtrl.disableMenuAndCategoriesAndProducts);
menuRouter.delete('/:menuId', validators.validateDelete, menuCtrl.deleteMenu);

module.exports = menuRouter;