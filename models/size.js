'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sizeSchema = Schema({
  name: { type: String, required: true, unique: true },
  available: { type: Boolean },
  businessUnits: { type: [Schema.Types.ObjectId], required: true }
});

module.exports = mongoose.model('Size', sizeSchema);