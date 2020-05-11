'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paramSchema = Schema({
  _id: { type: String, required: true },
  description: { type: String, required: true },
  value: { type: Boolean, required: true } 
});

module.exports = mongoose.model('Param', paramSchema);