'use strict'

const NotificationService = require('../services/notification');
const NotificationTypeService = require('../services/notificationType');
const HttpStatus = require('http-status-codes');

async function addPushSubscriber(req, res) {
    console.log(req);
    try {
        let subscriptionSaved = await NotificationService.saveSuscription(req.body);
        res.status(HttpStatus.OK).send({ subscription: subscriptionSaved });
    }
    catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
    }
}

async function getNotificationTypes(req, res) {
    try {
        let notificationTypes = await NotificationService.getTypes();
        res.status(HttpStatus.OK).send({ notificationTypes: notificationTypes });
    }
    catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
    }
}

async function send(req, res) {

    try {
        const notificationSaved = await NotificationService.saveNotification(req.body);

        const allSubscriptions = await NotificationService.getSubscriptions();
    
        const notificationType = await NotificationTypeService.getNotificationType(req.body.notificationType);
        
        //ver el tema del notificationtype para armar la notification a enviar al servidor de chrome
        const notificationPayload = {
            "notification": {
                "title": "Bonapp dice:",
                "body": notificationType.message + req.body.table,
                "vibrate": [100, 50, 100],
                "data": req.body.data,
                "actions": req.body.actions
            }
        };
        Promise.all(allSubscriptions.map(sub =>
            NotificationService.sendNotification(sub, notificationPayload)))
            .then(notificationsSent => {
                res.status(HttpStatus.OK).send({ notificationsSent: notificationsSent })
            })
            .catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
            });
    }
    catch (err){
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
    }
}

module.exports = {
    addPushSubscriber,
    send,
    getNotificationTypes
}