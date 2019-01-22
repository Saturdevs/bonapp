'use strict'

const Product = require('../models/product')

function getProducts (req, res) {
  let query = {};

  if(req.query.name) {
    query.name = req.query.name
  }

  Product.find(query, null, {sort: {code: 1}}, (err, products) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!products) return res.status(404).send({ message: `No existen productos`})

    res.status(200).send({ products })
  })
}

function getProduct (req, res) {
  let productId = req.params.productId

  Product.findById(productId, (err, product) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!product) return res.status(404).send({ message: `El producto no existe`})

    res.status(200).send({ product }) //Cuando la clave y el valor son iguales
  })
}

function getProductsWithCategory (req, res) {
  Product.find({}).populate('category')
    .exec((err, products) => {
      if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
      Product.populate(products, {
        path: 'category.menuId',
        model: 'Menu'
      },
      (err, prods) => {
        if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
        if (!products) return res.status(404).send({ message: `No existen productos registrados en la base de datos.`})
        
        res.status(200).send({ products })
      })      
    })    
}

function getProductByCategory (req, res) {
  let categoryId = req.params.categoryId

  Product.find({ category: categoryId }).populate('category')
    .exec((err, products) => {
      if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
      Product.populate(products, {
        path: 'category.menuId',
        model: 'Menu'
      },
      (err, prods) => {
        if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
        if (!products) return res.status(404).send({ message: `No existen productos registrados en la base de datos.`})
        
        res.status(200).send({ products })
      })      
    })   
}

function saveProduct(req, res) {
  console.log('POST /api/prodcut')
  console.log(req.body)

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

  product.save((err, productStored) => {
    if(err){
      if(err['code'] == 11000) 
        return res.status(500).send({ message: `Ya existe un producto con ese nombre. Ingrese otro nombre.` })
      return res.status(500).send({ message: `Error al guardar en la base de datos: ${err}` });
    }

    res.status(200).send({ product: productStored })
  })
}

function updateProduct (req, res) {
  let productId = req.params.productId
  let bodyUpdate = req.body

  Product.findByIdAndUpdate(productId, bodyUpdate, (err, productUpdated) => {
     if(err){
      if(err['code'] == 11000) 
        return res.status(500).send({ message: `Ya existe un producto con ese nombre. Ingrese otro nombre.` })
    }
    res.status(200).send({ product: productUpdated })
  })
}

function deleteProduct (req, res) {
  let productId = req.params.productId

  Product.findById(productId, (err, product) => {
    if (err) return res.status(500).send({ message: `Error al querer borrar el producto: ${err}`})

    product.remove(err => {
      if (err) return res.status(500).send({ message: `Error al querer borrar el producto: ${err}`})
      res.status(200).send({message: `El producto ha sido eliminado`})
    })
  })
}

module.exports = {
  getProduct,
  getProductByCategory,
  getProducts,
  getProductsWithCategory,
  saveProduct,
  updateProduct,
  deleteProduct
}