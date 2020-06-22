'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = Schema({
  endpoint: { type: String, required: true },
  expirationTime: { type: Date },
  options: { 
    applicationServerKey: { type: ArrayBuffer },
    userVisibleOnly: { type: Boolean },
   }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);