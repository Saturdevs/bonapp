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

async function getNonReadNotifications(req, res){
    try {
        let notifications = await NotificationService.getNonReadNotifications();
        notifications.forEach(async (notification) => {
            console.log('getNonReadNotifications Entro al foreach =>', notification);
            let notificationType = await NotificationTypeService.getNotificationType(notification.notificationType);
            let notificationIndex = notifications.indexOf(notification);
            notifications[notificationIndex].notificationTypeDetail = notificationType;
            console.log('getNonReadNotifications notifications con el detalle =>', notifications[notificationIndex]);
        });
        res.status(HttpStatus.OK).send({notificaions: notifications});
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
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

        if (allSubscriptions.length >= 1) {
            const subscription = allSubscriptions[allSubscriptions.length - 1];
            NotificationService.sendNotification(subscription, notificationPayload)
                .then(notificationsSent => {
                    res.status(HttpStatus.OK).send({ notificationsSent: notificationsSent })
                })
                .catch(err => {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
                });
        }
    }
    catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
    }
}

module.exports = {
    addPushSubscriber,
    send,
    getNotificationTypes,
    getNonReadNotifications
}