'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Menu = require('../models/menu');

const categorySchema = Schema({
  name:  { type: String, unique: true, required: true }, //name
  menuId: { type: Schema.Types.ObjectId, ref: Menu , required: true}, //id del menu al que pertenece la categoría
  picture: { type: String, required: true },
  available: { type: Boolean, required: true },
  businessUnits: { type: [Schema.Types.ObjectId], required: true }
});

module.exports = mongoose.model('Category', categorySchema);