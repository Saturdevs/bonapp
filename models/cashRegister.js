'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cashRegisterSchema = Schema({
  name:  { type: String, unique: true, required: true }, 
  available: { type: Boolean },
  default: { type: Boolean, required: true} //determina si la caja es la caja por defecto o no
});

module.exports = mongoose.model('CashRegister', cashRegisterSchema);