'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BUSINESS_TYPES = require('../shared/enums/businessTypes');

const settingsSchema = Schema({
  restaurantId: { type: String, required: true, unique: true }, 
  name: {type: String, required: true},
  phoneNumber: { type: String },
  email: { type: String }, 
  address: { type: String }, 
  wifi: { type: String },
  businessType: { type: String, required: true, enum: [BUSINESS_TYPES.BAR, BUSINESS_TYPES.HOTEL] }
});

module.exports = mongoose.model('Settings', settingsSchema);