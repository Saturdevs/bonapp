'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('../models/product');

const dailyMenuSchema = Schema({
  name: { type: String, required: true, unique: true },
  //Pictures must start with "http://"
  pictures: { type: String, required: true },
  description: { type: String, required: true },
  //Si hay distintos tamaños este precio se correspondera con el precio del tamaño por default
  price: { type: Number, required: true },  
  products: [{ type: Schema.Types.ObjectId, ref: Product, required: true }],
  startDate: { type: Date, required: true},
  endDate: { type: Date, required: true},
  businessUnits: { type: [Schema.Types.ObjectId], required: true }
})

module.exports = mongoose.model('DailyMenu', dailyMenuSchema);