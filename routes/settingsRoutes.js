'use strict'

const express = require('express');
const settingsCtrl = require('../controllers/settings');
const settingsRouter = express.Router();
const validators = require('../middlewares/section/validators');
const authorize = require('../middlewares/auth/authorize');

sectionRouter.get('/', authorize(), settingsCtrl.getSettings);

module.exports = settingsRouter;