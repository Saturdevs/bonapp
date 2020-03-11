'use strict'

const Notification = require('../models/notification');
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

module.exports = {
    saveSuscription,
    getSuscriptions
}