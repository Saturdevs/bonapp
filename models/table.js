'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Section = require('../models/section');
const TableStatus = require('../shared/enums/tableStatus');

const tableSchema = Schema({
  number: { type: Number, unique: true, required: true },
  section: { type: Schema.Types.ObjectId, ref: Section, required: true },
  status: { type: String, enum: [TableStatus.LIBRE, TableStatus.OCUPADA, TableStatus.COMANDADA, TableStatus.RESERVADA] },
  col: { type: Number, required: true },
  row: { type: Number, required: true },
  sizex: { type: Number, required: true },
  sizey: { type: Number, required: true },
  businessUnits: { type: Schema.Types.ObjectId, required: true }
}); 

module.exports = mongoose.model('Table', tableSchema);