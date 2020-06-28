'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Category = require('../models/category');
const Size = require('../models/size');

const productSchema = Schema({  
  name: { type: String, required: true, unique: true },
  //Pictures must start with "http://"
  category: { type: Schema.Types.ObjectId, ref: Category, required: true },
  pictures: { type: String, required: true },
  description: { type: String, required: true },
  //Si hay distintos tamaños este precio se correspondera con el precio del tamaño por default
  price: { type: Number, required: true },  
  options: [{ 
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  sizes: [{
    sizeId: { type: Schema.Types.ObjectId, ref: Size, required: true },
    price: { type: Number, required: true },
    default: { type: Boolean, required: true}
  }],
  available: { type: Boolean, required: true },
  tags: [{ type: String }],
  stockControl: { type: Boolean, required: true},
  stock: {
    min: { type: Number },
    current: { type: Number}
  }
})

module.exports = mongoose.model('Product', productSchema);