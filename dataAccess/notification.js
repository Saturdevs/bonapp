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
 * @description Guarda la suscripcion en la base
 * @param {Subscription} Subscription
 */
async function getSuscriptions() {
  try {
    let subscriptions = await Subscription.find({});
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
    let notificationTypes = await NotificationType.find({});
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
 * @description Updatea la notificacion en la base
 * @param {notification} notification
 */
async function updateNotification(notificationId, bodyUpdate, opts = {}) {
  try {
    if (notificationId === null || notificationId === undefined) {
      throw new Error('El id de la notification a actualizar no puede ser nulo');
    }

    let notificationSaved = await Notification.findByIdAndUpdate(notificationId, bodyUpdate, opts);
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
    let notificationTypes = await NotificationType.find({});
    let notifications = await Notification.find({});
    let nonReadNotifications = notifications.filter(x => x.readBy === null);

    nonReadNotifications.map(notif => {
      notif.detailedType = notificationTypes.find(x => x._id === notif.notificationType);
      console.log(notif);
    });

    console.log(nonReadNotifications);
    return nonReadNotifications;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Devuelve la suscripcion según el id dado como parámetro
 * @param {*} subscriptionId id de la suscripcion que se quiere recuperar de la base de datos.
 */
async function getSubscriptionById(subscriptionId) {
  try {
    if (subscriptionId === null || subscriptionId === undefined) {
      throw new Error('El id de la suscripción que se quiere recuperar de la base de datos no puede ser nulo');
    }

    return await Subscription.findById(subscriptionId);
  } catch (err) {
    throw new Error(err);
  }
}


module.exports = {
  saveSuscription,
  getSuscriptions,
  saveNotification,
  getTypes,
  getNonReadNotifications,
  updateNotification,
  getSubscriptionById
}