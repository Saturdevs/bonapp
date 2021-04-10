'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = Schema({
  name: { type: String, unique: true, required: true },
  picture: { type: String, required: true },
  available: {type: Boolean, required: true},
  businessUnits: { type: [Schema.Types.ObjectId], required: true }
});

module.exports = mongoose.model('Menu', menuSchema);