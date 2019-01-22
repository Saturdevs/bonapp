'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user');
const PaymentType = require('../models/paymentType');
const CashRegister = require('../models/cashRegister');

const cashFlowSchema = Schema({
  cashRegisterId: { type: Schema.Types.ObjectId, ref: CashRegister, required: true },
  date: { type: Date, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  totalAmount: { type: Number, required: true },
  type: { type: String, enum: ['Ingreso', 'Egreso']},
  paymentType: { type: Schema.Types.ObjectId, ref: 'PaymentType', required: true},
  comment: { type: String },
  deleted: { type: Boolean }
});

module.exports = mongoose.model('CashFlow', cashFlowSchema);