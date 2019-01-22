'use strict'

const express = require('express')
const sectionCtrl = require('../controllers/section')
const sectionRouter = express.Router()

sectionRouter.get('/', sectionCtrl.getSections)
sectionRouter.get('/:sectionId', sectionCtrl.getSection)
sectionRouter.post('/', sectionCtrl.saveSection)
sectionRouter.put('/:sectionId', sectionCtrl.updateSection)
sectionRouter.delete('/:sectionId', sectionCtrl.deleteSection)

module.exports = sectionRouter