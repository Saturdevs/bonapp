'use strict'

const express = require('express');
const sectionCtrl = require('../controllers/section');
const sectionRouter = express.Router();
const validators = require('../middlewares/section/validators');
const authorize = require('../middlewares/auth/authorize');

sectionRouter.get('/', authorize(), sectionCtrl.getSections);
sectionRouter.get('/:sectionId', authorize(), sectionCtrl.getSection);
sectionRouter.post('/', authorize(), sectionCtrl.saveSection);
sectionRouter.put('/:sectionId', authorize(), sectionCtrl.updateSection);
sectionRouter.delete('/:sectionId', authorize(), validators.validateDelete, sectionCtrl.deleteSection);

module.exports = sectionRouter;