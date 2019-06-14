'use strict'

const express = require('express')
const genericValidatorCtrl = require('../controllers/genericValidator')
const validateNameRouter = express.Router()

validateNameRouter.post('/:collectionName/:objectName', genericValidatorCtrl.validateName)

module.exports = validateNameRouter