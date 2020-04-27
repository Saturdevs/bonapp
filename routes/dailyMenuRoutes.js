'use strict'

const express = require('express');
const dailyMenuCtrl = require('../controllers/dailyMenu');
const dailyMenuRouter = express.Router();
const authorize = require('../middlewares/auth/authorize');

dailyMenuRouter.get('/', authorize(), dailyMenuCtrl.getDailyMenus);
dailyMenuRouter.get('/availables', authorize(), dailyMenuCtrl.getAvailableDailyMenus);
dailyMenuRouter.get('/:dailyMenuId', authorize(), dailyMenuCtrl.getDailyMenu);
dailyMenuRouter.get('/:dailyMenuId', authorize(), dailyMenuCtrl.getDailyMenu);
dailyMenuRouter.post('/', authorize(), dailyMenuCtrl.saveDailyMenu);
dailyMenuRouter.put('/:dailyMenuId', authorize(), dailyMenuCtrl.updateDailyMenu);

module.exports = dailyMenuRouter;