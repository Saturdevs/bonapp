'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NotificationTypes = require('../shared/enums/notificationTypes');

const notificationTypeSchema = Schema({
  //Id del tipo de la notificacion.
  _id: { 
    type: String, 
    enum: [NotificationTypes.TABLE_TAKEN, NotificationTypes.NEW_ORDER, NotificationTypes.CALL_WAITER], 
    required: true
  },
  //Mensaje que se muestra al usuario.
  message: { 
    type: String, 
    required: true, 
    unique: true
  },
  //Duracion que tiene la notificacion cuando se muestra en pantalla.
  duration: {
    type: Number, 
    required: true
  },
  //Tiempo que debe pasar para que la notificacion se vuelva a mandar si no fue leida.
  repeatTime: {
    type: Number,
    required: true
  },
  //Cantidad de veces que se va a reenviar la notificacion antes de avisar al usuario
  //que la notificacion no fue recibida por el encargado de leerla.
  repeatAttempts: {
    type: Number,
    required: true
  }  
});

module.exports = mongoose.model('NotificationType', notificationTypeSchema);