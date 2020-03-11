'use strict'

const Suscription = require('../models/subscription');
const NotificationDAO = require('../dataAccess/notification');
const config = require('../config');
const webpush = require('web-push');


/**
 * @description Crea una nueva suscription y la guarda en la db.
 * @param {JSON} reqBody request body.
 * @returns suscription guardada en la base de datos.
 */
async function saveSuscription(reqBody) {
    let suscriptionSaved = await NotificationDAO.saveSuscription(reqBody);
    return suscriptionSaved;
}

async function getSubscriptions() {
    let subscriptions = await NotificationDAO.getSuscriptions();
    return subscriptions
}

async function setVapidDetails() {
    webpush.setVapidDetails(
        'mailto:example@yourdomain.org', //ver
        config.VAPID_PUBLIC_KEY,
        config.VAPID_PRIVATE_KEY
    );
}

async function sendNotification(subscription, notificationPayload){
    return webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
}

module.exports = {
    saveSuscription,
    setVapidDetails,
    getSubscriptions,
    sendNotification
}