'use strict'

const Notification = require('../models/notification');
const NotificationType = require('../models/notificationType');
const Subscription = require('../models/subscription');

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Guarda la caja suscripcion en la base
 * @param {Subscription} Subscription
 */
async function saveSuscription(subscription) {
    try {
        if (subscription === null || subscription === undefined) {
            throw new Error('La suscripcion es null or undefined.');
        }

        let subscriptionSaved = await Subscription.create(subscription);
        return subscriptionSaved
    } catch (err) {
        throw new Error(err);
    }
}

/**
 * @description Guarda la caja suscripcion en la base
 * @param {Subscription} Subscription
 */
async function getSuscriptions() {
    try {
        let subscriptions = await Subscription.find();
        return subscriptions
    } catch (err) {
        throw new Error(err);
    }
}

/**
 * @description Devuelve los tipos de notificaciones
 */
async function getTypes() {
    try {
        let notificationTypes = await NotificationType.find();
        return notificationTypes
    } catch (err) {
        throw new Error(err);
    }
}

/**
 * @description Guarda la notificacion en la base
 * @param {Subscription} Subscription
 */
async function saveNotification(notification) {
    try {
        let notificationSaved = await Notification.create(notification);
        return notificationSaved
    } catch (err) {
        throw new Error(err);
    }
}

/**
 * @description Devuelve notificaciones no leidas
 */
async function getNonReadNotifications() {
    try {
        let notifications = await Notification.find();
        let nonReadNotifications = notifications.find(x => x.readBy.length == 0);
        return nonReadNotifications
    } catch (err) {
        throw new Error(err);
    }
}


module.exports = {
    saveSuscription,
    getSuscriptions,
    saveNotification,
    getTypes,
    getNonReadNotifications
}