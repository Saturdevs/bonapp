'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sizeSchema = Schema({
  name: { type: String, required: true, unique: true },
  available: { type: Boolean }
});

module.exports = mongoose.model('Size', sizeSchema);