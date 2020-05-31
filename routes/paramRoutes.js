'use strict'

const express = require('express');
const paramCtrl = require('../controllers/param');
const paramRouter = express.Router();

paramRouter.get('/', paramCtrl.getAllParams);

module.exports = paramRouter;