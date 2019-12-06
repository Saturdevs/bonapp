'use strict'

const express = require('express');
const sectionCtrl = require('../controllers/section');
const sectionRouter = express.Router();
const validators = require('../middlewares/section/validators');

sectionRouter.get('/', sectionCtrl.getSections);
sectionRouter.get('/:sectionId', sectionCtrl.getSection);
sectionRouter.post('/', sectionCtrl.saveSection);
sectionRouter.put('/:sectionId', sectionCtrl.updateSection);
sectionRouter.delete('/:sectionId', validators.validateDelete, sectionCtrl.deleteSection);

module.exports = sectionRouter;