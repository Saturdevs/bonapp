'use strict'

const express = require('express');
const notificationCtrl = require('../controllers/notification');
const notificationRouter = express.Router();

notificationRouter.post('/', notificationCtrl.addPushSubscriber);
notificationRouter.post('/send', notificationCtrl.send);
notificationRouter.get('/types', notificationCtrl.getNotificationTypes);
notificationRouter.get('/nonRead', notificationCtrl.getNonReadNotifications);

module.exports = notificationRouter;