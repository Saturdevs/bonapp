'use strict'

const NotificationService = require('../services/notification');
const HttpStatus = require('http-status-codes');

async function addPushSubscriber(subscription) {
    console.log(subscription);
    try {
        let subscriptionSaved = await NotificationService.saveSuscription(req.body);
        res.status(HttpStatus.OK).send({ subscription: subscriptionSaved });
    }
    catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
    }
}

async function getNotificationTypes() {
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
    
        console.log('Total subscriptions', allSubscriptions.length);
        //ver el tema del notificationtype para armar la notification a enviar al servidor de chrome
        const notificationPayload = {
            "notification": {
                "title": "Bonapp says:",
                "body": "New Notification!!",
                "vibrate": [100, 50, 100],
                "data": {
                    "dateOfArrival": Date.now(),
                    "primaryKey": 1
                },
                "actions": [{
                    "action": "explore",
                    "title": "Go to the site"
                }]
            }
        };
    
        Promise.all(allSubscriptions.map(sub =>
            NotificationService.sendNotification(sub, notificationPayload)))
            .then(result => {
                res.status(HttpStatus.OK).send({ subscription: subscriptionSaved })
                console.log(result);
            })
            .catch(err => {
                res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
            });
    }
    catch{
        res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
    }
}

module.exports = {
    addPushSubscriber,
    send,
    getNotificationTypes
}