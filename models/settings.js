'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingsSchema = Schema({
  _id: { type: String, required: true },
  restaurantId: { type: String, required: true }, 
  name: {type: String, required: true},
  phoneNumber: { type: String },
  email: { type: String }, 
  address: { type: String }, 
  wifi: { type: String }
});

module.exports = mongoose.model('Settings', settingsSchema);