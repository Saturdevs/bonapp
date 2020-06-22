'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = Schema({
  endpoint: { type: String, required: true },
  expirationTime: { type: Date },
  keys: { 
      p256dh: {type: String},
      auth: { type: String }
    }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);