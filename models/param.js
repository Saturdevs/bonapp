'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paramSchema = Schema({
  code: { type: String, required: true },
  description: { type: String, required: true },
  value: { type: Boolean, required: true },
  businessUnits: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('Param', paramSchema);