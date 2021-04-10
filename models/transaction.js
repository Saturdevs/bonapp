'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PaymentMethod = require('../models/paymentType');
const CashRegister = require('../models/cashRegister');
const Client = require('../models/client');

const transactionSchema = Schema({
  amount: { type: Number, required: true },
  paymentMethod: { type: Schema.Types.ObjectId, ref: PaymentMethod, required: true },
  cashRegister: { type: Schema.Types.ObjectId, ref: CashRegister, required: true },
  date: { type: Date, default: Date.now() },
  comment: { type: String },
  deleted: { type: Boolean, required: true },
  client: { type: Schema.Types.ObjectId, ref: Client, required: true },
  businessUnits: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('Transaction', transactionSchema);