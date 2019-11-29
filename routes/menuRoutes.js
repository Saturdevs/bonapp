'use strict'

const express = require('express');
const menuCtrl = require('../controllers/menu');
const menuRouter = express.Router();
const validators = require('../middlewares/menu/validators');

menuRouter.get('/', menuCtrl.getMenus);
menuRouter.get('/:menuId', menuCtrl.getMenu);
menuRouter.get('/hasOneCategory/:menuId', menuCtrl.hasAtLeastOneCategory);
menuRouter.post('/', menuCtrl.saveMenu);
menuRouter.put('/:menuId', menuCtrl.updateMenu);
menuRouter.delete('/:menuId', validators.validateDelete, menuCtrl.deleteMenu);

module.exports = menuRouter;