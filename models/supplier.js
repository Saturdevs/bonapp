'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supplierSchema = Schema({
  tel: { type: Number },
  name: { type: String, required: true },
  email: { type: String, unique: true },
  addressStreet: { type: String },
  addressNumber: { type: Number },
  addressDpto: {type: String },
  active: { type: Boolean, required: true },
  businessUnits: { type: [Schema.Types.ObjectId], required: true }
});

module.exports = mongoose.model('Supplier', supplierSchema);