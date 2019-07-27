'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PaymentMethod = require('../models/paymentType')
const CashRegister = require('../models/cashRegister')

const clientSchema = Schema({
  tel: { type: String },
  name: { type: String, required: true },
  addressStreet: { type: String },
  addressNumber: { type: Number },
  addressDpto: {type: String },
  enabledTransactions: { type: Boolean, required: true }, //Determina si tiene cuenta corriente o no  
  balance: { type: Number, required: true }, //saldo del cliente a la fecha de realizada la transacción. 
                                             //Debe actualizarse cada vez que se realiza una transacción
  transactions: [{
    amount: { type: Number, required: true },
    paymentMethod: { type: Schema.Types.ObjectId, ref: PaymentMethod, required: true },
    cashRegister: { type: Schema.Types.ObjectId, ref: CashRegister, required: true },
    date: { type: Date, default: Date.now() },    
    comment: { type: String },
    deleted: { type: Boolean, required: true }
  }, { _id: true }]
});

module.exports = mongoose.model('Client', clientSchema);