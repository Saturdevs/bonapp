'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = Schema({
  //Este modelo está vacío porque se guardan las subscripciones que se recibien de la api de google cuando
  //el usuario acepta recibir notificaciones. NO tenemos un modelo propio.
});

module.exports = mongoose.model('Subscription', subscriptionSchema);