'use strict'

const express = require('express')
const genericValidatorCtrl = require('../controllers/genericValidator')
const genericValidationsRouter = express.Router()

genericValidationsRouter.post('/validateName/:collectionName/:objectName', genericValidatorCtrl.validateName)

module.exports = genericValidationsRouter