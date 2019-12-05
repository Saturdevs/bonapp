'use strict'

const Product = require('../models/product');
const ProductService = require('../services/product');
const HttpStatus = require('http-status-codes');

async function getProducts (req, res) {
  try {
    let products = await ProductService.getAll();

    if (products !== null && products !== undefined) {
      res.status(HttpStatus.OK).send({ products });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen productos almacenadas en la base de datos.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getProduct (req, res) {
  try {
    let productId = req.params.productId;
    let product = await ProductService.getProduct(productId);

    if (product !== null && product !== undefined) {
      res.status(HttpStatus.OK).send({ product });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `El producto ${productId} no existe en la base da datos` });
    }
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getProductsByCategory (req, res) {
  try {
    let categoryId = req.params.categoryId;
    let products = await ProductService.getProductsByCategory(categoryId);

    if (products !== null && products !== undefined) {
      res.status(HttpStatus.OK).send({ products });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen productos registrados en la base de datos.` });
    }
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }  
}

async function existInAnOrder(req, res) {
  try {
    let productId = req.params.productId;
    let order = await ProductService.existInAnOrder(productId);

    res.status(HttpStatus.OK).send({ order });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function saveProduct(req, res) {
  try {
    let product = new Product()
    product.code = req.body.cod
    product.name = req.body.name
    product.category = req.body.category
    product.pictures = req.body.picture
    product.description = req.body.description
    product.price = req.body.price
    product.options = req.body.options
    product.sizes = req.body.sizes
    product.available = req.body.available

    let productSaved = await ProductService.saveProduct(product);

    res.status(HttpStatus.OK).send({ product: productSaved });
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  } 
}

async function updateProduct (req, res) {
  try {
    let productId = req.params.productId;
    let bodyUpdate = req.body

    let productUpdated = await ProductService.update(productId, bodyUpdate);
    res.status(HttpStatus.OK).send({ product: productUpdated });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer actualizar el producto: ${err.message}.` });
  }
}

async function updatePrice (req, res) {
  try {
    let productsToUpdate = req.body.productsToUpdate;
    let updateRate = req.body.rate;

    let productsUpdated = await ProductService.updatePrice(productsToUpdate, updateRate);
    res.status(HttpStatus.OK).send({ products: productsUpdated });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer actualizar el precio de los productos: ${err.message}.` });
  }
}

async function deleteProduct (req, res) {
  try {
    let productId = req.params.productId;
    ProductService.deleteProduct(productId);
    res.status(HttpStatus.OK).send({ message: `El producto ha sido eliminado de la base de datos correctamente.` });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer borrar el producto de la base de datos: ${err.message}` })
  }
}

module.exports = {
  getProduct,
  getProductsByCategory,
  getProducts,
  existInAnOrder,
  saveProduct,
  updateProduct,
  updatePrice,
  deleteProduct
}