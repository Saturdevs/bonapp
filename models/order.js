'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CashRegister = require('../models/cashRegister')
const Product = require('../models/product')
const Table = require('../models/table')
const User = require('../models/user')
const PaymentMethod = require('../models/paymentType')

const orderSchema = Schema({
  orderNumber: { type: String, required: true, unique: true },  //n�mero de orden
  type: { type: String, required: true, enum: ['Delivery', 'Restaurant', 'Mostrador'] },
  table: { type: Schema.Types.ObjectId, ref: Table },
  cashRegister: { type: Schema.Types.ObjectId, ref: CashRegister, required: true }, //si el pago se realiza por la app setearle la caja por defecto
  waiter: { type: Schema.Types.ObjectId, ref: User }, //no es requerido porque si se realiza el pedido desde la app, es delivery 
                                                      //o se pide por mostrador no se asigna ningun mozo
  status: { type: String, required: true, enum: ['Open', 'Closed', 'Delivered', 'Not Received'] },
  orderApp: { type: Boolean, required: true }, //si el pedido se hace por la app va true.
  users: [{
    id: { type: Schema.Types.ObjectId },
    products: [{
      id: { type: Schema.Types.ObjectId, ref: Product, required: true },
      options: [{
        name: { type: String, required:true },
        price: { type: Number, required: true }
      }],
      price: { type: Number, required: true },
      size: {
        name: { type: String, required: true },
        price: { type: Number, required: true }
      },      
      observations: { type: String }      
    }],
    subtotal: { type:Number, required: true },
    payment: [{
      amount: { type: Number, required: true },
      methodId: { type: Schema.Types.ObjectId, ref: PaymentMethod, required: true } 
    }],
    owner: { type: Boolean, required: true }
  }],
  created_at: { type: Date, required: true },
  sent_at: { type: Date }, //cuando se envia el pedido en caso de ser delivery. Para calcular estadisticas de cuanto 
                           //se tarda entre que se realiza el pedido y se envia
  completed_at: { type: Date },  
  discountPercentage: { type: Number },
  totalPrice: { type: Number }
});

module.exports = mongoose.model('Order', orderSchema)