'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Category = require('../models/category')

const menuSchema = Schema({
  name: { type: String, unique: true, required: true },
  picture: { type: String, required: true },
  canEdit: { type: Boolean }
});

module.exports = mongoose.model('Menu', menuSchema);