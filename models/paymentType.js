'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const paymentTypeSchema = Schema({
  name: { type: String, required: true, unique: true },
  available: { type: Boolean, required: true },
  //determina si es la forma de pago por defecto. Solo puede haber uno en true
  default: { type: Boolean, required: true },
  //determina si es forma de pago cuenta corriente. Solo puede haber uno en true
  currentAccount: { type: Boolean, required: true },
  //true si es tipo de pago efectivo, false si no lo es. Solo puede haber uno en true.
  cash: { type: Boolean, required: true },
  businessUnits: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('PaymentType', paymentTypeSchema);