'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Section = require('../models/section');

const tableSchema = Schema({
  number: { type: Number, unique: true, required: true },
  section: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
  status: { type: String, enum: ['Libre', 'Ocupada', 'Comandada', 'Reservada'] },
  col: { type: Number, required: true },
  row: { type: Number, required: true },
  sizex: { type: Number, required: true },
  sizey: { type: Number, required: true }  
}); 

module.exports = mongoose.model('Table', tableSchema);