'use strict'

const express = require('express');
const dailyMenuCtrl = require('../controllers/dailyMenu');
const dailyMenuRouter = express.Router();

dailyMenuRouter.get('/', dailyMenuCtrl.getDailyMenus);
dailyMenuRouter.get('/availables', dailyMenuCtrl.getAvailableDailyMenus);
dailyMenuRouter.get('/:dailyMenuId', dailyMenuCtrl.getDailyMenu);
dailyMenuRouter.get('/:dailyMenuId', dailyMenuCtrl.getDailyMenu);
dailyMenuRouter.post('/', dailyMenuCtrl.saveDailyMenu);
dailyMenuRouter.put('/:dailyMenuId', dailyMenuCtrl.updateDailyMenu);

module.exports = dailyMenuRouter;