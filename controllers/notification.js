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


async function updateNotification(req, res) {
  let notificationId = req.params.notificationId;
  let bodyUpdate = req.body;

  try {
    let notification = await NotificationService.updateNotification(notificationId, bodyUpdate);
    res.status(HttpStatus.OK).send({ notification: notification });
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

async function getNonReadNotifications(req, res) {
  try {
    let notifications = await NotificationService.getNonReadNotifications();
    res.status(HttpStatus.OK).send({ notificaions: notifications });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
  }
}

async function send(req, res) {

  try {

    const notificationSaved = await NotificationService.saveNotification(req.body);
    console.log('NotificationController Send notificationSaved =>', notificationSaved);

    const allSubscriptions = await NotificationService.getSubscriptions();
    console.log('NotificationController Send allSubscriptions =>', allSubscriptions);

    const notificationType = await NotificationTypeService.getNotificationType(req.body.notificationType);
    console.log('NotificationController Send notificationType =>', notificationType);

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
    console.log('NotificationController Send err =>', err);

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

async function deleteSubscription(req, res) {
  try {
    let notificationId = req.params.notificationId;
    await NotificationService.deleteSubscription(notificationId);
    res.status(HttpStatus.OK).send({ message: `La subscripción a notificaciones ha sido eliminada de la base de datos correctamente.` });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer borrar la subscripción a notificaciones de la base de datos: ${err.message}` })
  }
}

module.exports = {
  addPushSubscriber,
  send,
  getNotificationTypes,
  getNonReadNotifications,
  updateNotification,
  deleteSubscription
}