'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user');
const PaymentType = require('../models/paymentType');
const CashRegister = require('../models/cashRegister');

const arqueoSchema = Schema({
  cashRegisterId: { type: Schema.Types.ObjectId, ref: CashRegister, required: true },
  createdAt: { type: Date, required: true },
  closedAt: { type: Date },
  createdBy: { type: Schema.Types.ObjectId, ref: User, required: true },
  closeBy: { type: Schema.Types.ObjectId, ref: User },
  initialAmount: { type: Number, required: true },
  ingresos: [{ 
    paymentType: { type: Schema.Types.ObjectId, ref: PaymentType, required: true }, 
    desc: { type: String, enum: ['Movimiento de Caja', 'Ventas', 'Cobros clientes cta. cte'], required: true},
    amount: { type: Number, required: true } 
  }],
  egresos: [{ 
    paymentType: { type: Schema.Types.ObjectId, ref: PaymentType, required: true }, 
    desc: { type: String, enum: ['Movimiento de Caja', 'Pagos proveedores cta. cte'], required: true},
    amount: { type: Number, required: true } 
  }],
  realAmount: [{ 
    paymentType: { type: Schema.Types.ObjectId, ref: PaymentType, required: true },
    amount: { type: Number, required: true }
  }], //se actualiza cuando se cierra el arqueo. es el monto real en la caja al momento del cierre y es ingresado 
                               //por la persona encargada de hacer el cierre del arqueo. hay que validar desde el front end que sea obligatorio
                               //ingrsarlo al momento de cerrar el arqueo.
  comment: { type: String },
  deleted: { type: Boolean, required: true},
  deletedBy: { type: Schema.Types.ObjectId, ref: User }
});

module.exports = mongoose.model('Arqueo', arqueoSchema);