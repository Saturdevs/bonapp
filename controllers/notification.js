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

async function send(req, res) {

    const allSubscriptions = await NotificationService.getSubscriptions();

    console.log('Total subscriptions', allSubscriptions.length);

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
        .then(() => res.status(HttpStatus.OK).send({ subscription: subscriptionSaved })
            .catch(err => {
                res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
            })
        );
}


module.exports = {
    addPushSubscriber,
    send
}