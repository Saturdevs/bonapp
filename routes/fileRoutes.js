'use strict'

const express = require('express')
const fileCtrl = require('../controllers/file')
const fileRouter = express.Router()

fileRouter.post('/',fileCtrl.saveFile)

module.exports = fileRouter