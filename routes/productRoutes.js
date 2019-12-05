'use strict'

const express = require('express');
const productCtrl = require('../controllers/product');
const productRouter = express.Router();
const validators = require('../middlewares/product/validators');

productRouter.get('/', productCtrl.getProducts);
productRouter.get('/:productId', productCtrl.getProduct);
productRouter.get('/category/:categoryId', productCtrl.getProductsByCategory);
productRouter.get('/existInAnOrder/:productId', productCtrl.existInAnOrder);
productRouter.post('/', productCtrl.saveProduct);
productRouter.put('/updatePrice', productCtrl.updatePrice);
productRouter.put('/:productId', productCtrl.updateProduct);
productRouter.delete('/:productId', validators.validateDelete, productCtrl.deleteProduct);

module.exports = productRouter;