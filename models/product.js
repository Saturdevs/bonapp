'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Category = require('../models/category');

const productSchema = Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  //Pictures must start with "http://"
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  pictures: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },  //Si hay distintos tamaños este precio se correspondera con el precio del tamaño mas chico
  options: [{ 
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  sizes: [{
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  available: { type: Boolean, required: true },
  tags: [{ type: String }]
})

module.exports = mongoose.model('Product', productSchema)