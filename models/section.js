'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sectionSchema = Schema({
  name: { type: String, unique: true, required: true },
  businessUnits: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('Section', sectionSchema);