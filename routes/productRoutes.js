'use strict'

const express = require('express');
const productCtrl = require('../controllers/product');
const productRouter = express.Router();
const validators = require('../middlewares/product/validators');
const authorize = require('../middlewares/auth/authorize');

productRouter.get('/', authorize(), productCtrl.getProducts);
productRouter.get('/:productId', authorize(), productCtrl.getProduct);
productRouter.get('/category/:categoryId', authorize(), productCtrl.getProductsByCategory);
productRouter.get('/availables/category/:categoryId', authorize(), productCtrl.getProductsAvailablesByCategory);
productRouter.post('/', authorize(), productCtrl.saveProduct);
productRouter.put('/updatePrice', authorize(), productCtrl.updatePrice);
productRouter.put('/:productId', authorize(), productCtrl.updateProduct);
productRouter.delete('/:productId', authorize(), validators.validateDelete, productCtrl.deleteProduct);

module.exports = productRouter;