'use strict'

const express = require('express')
const productCtrl = require('../controllers/product')
const productRouter = express.Router()

productRouter.get('/', productCtrl.getProducts)
productRouter.get('/:productId', productCtrl.getProduct)
productRouter.get('/category/:categoryId', productCtrl.getProductByCategory)
productRouter.post('/', productCtrl.saveProduct)
productRouter.put('/:productId', productCtrl.updateProduct)
productRouter.delete('/:productId', productCtrl.deleteProduct)
productRouter.get('/product/withcategory', productCtrl.getProductsWithCategory)

module.exports = productRouter