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
  balance: { type: Number, required: true } //saldo del cliente a la fecha de realizada la transacción. 
                                            //Debe actualizarse cada vez que se realiza una transacción
});

module.exports = mongoose.model('Client', clientSchema);