'use strict'

const express = require('express');
const settingsCtrl = require('../controllers/settings');
const settingsRouter = express.Router();
const validators = require('../middlewares/section/validators');
const authorize = require('../middlewares/auth/authorize');

settingsRouter.get('/', settingsCtrl.getSettings);

module.exports = settingsRouter;