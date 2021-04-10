'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { BUSINESS_UNITS_TYPES } = require('../shared/enums/enums')

const menuSchema = Schema({
  code: { type: String, unique: true, required: true, maxLength: 10, uppercase: true },
  name: { type: String, required: true, maxLength: 100 },
  type: { type: String, required: true, enum: [BUSINESS_UNITS_TYPES.RESTAURANT, BUSINESS_UNITS_TYPES.HOTEL, BUSINESS_UNITS_TYPES.BAR] },
  active: { type: Boolean, required: true, default: true },
});

module.exports = mongoose.model('BusinessUnit', menuSchema);