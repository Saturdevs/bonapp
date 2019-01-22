'use strict'

const Category = require('../models/category')

function getCategories (req, res) {
  Category.find({}, null, {sort: {name: 1}}, (err, categories) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!categories) return res.status(404).send({ message: `No existen cateogrías registradas en la base de datos.`})

    res.status(200).send({ categories })
  })
}

function getCategory (req, res) {
  let categoryId = req.params.categoryId

  Category.findById(categoryId, (err, category) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!category) return res.status(404).send({ message: `La categoría ${categoryId} no existe`})

    res.status(200).send({ category }) //Cuando la clave y el valor son iguales
  })
}

function getCategoryWithMenu (req, res) {
  Category.find({}, null, {sort: {name: 1}}).populate('menuId')
    .exec((err, categories) => {
      if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
      if (!categories) return res.status(404).send({ message: `No existen cateogrías registradas en la base de datos.`})

      res.status(200).send({ categories })
    })
}

function getCategoryByMenu (req, res) {
  let menuId = req.params.menuId

  Category.find({menuId: menuId}, null, {sort: {name: 1}}).populate('menuId')
    .exec((err, categories) => {
      if(err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})    
      if (!categories) return res.status(404).send({ message: `No existen categorías dentro del menú ${menuId}`})

      res.status(200).send({ categories })
  })
}

function saveCategory (req, res) {
  console.log('POST /api/category')
  console.log(req.body)

  let category = new Category()
  category.name = req.body.name
  category.number_of_items = req.body.number_of_items
  category.menuId = req.body.menuId
  category.picture = req.body.picture

  category.save((err, categoryStored) => {
    if(err){
      if(err['code'] == 11000) 
        return res.status(500).send({ message: `Ya existe una categoria con ese nombre. Ingrese otro nombre.` })
    }

    res.status(200).send({ category: categoryStored })
  })
}

function updateCategory (req, res) {
  let categoryId = req.params.categoryId
  let bodyUpdate = req.body

  Category.findByIdAndUpdate(categoryId, bodyUpdate, (err, categoryUpdated) => {
    if(err){
      if(err['code'] == 11000) 
        return res.status(500).send({ message: `Ya existe una categoria con ese nombre. Ingrese otro nombre.` })
    }

    res.status(200).send({ category: categoryUpdated })
  })
}

function deleteCategory (req, res) {
  let categoryId = req.params.categoryId

  Category.findById(categoryId, (err, category) => {
    if (err) return res.status(500).send({ message: `Error al querer borrar la categoría: ${err}`})

    category.remove(err => {
      if (err) return res.status(500).send({ message: `Error al querer borrar la categoría: ${err}`})
      res.status(200).send({message: `La categoría ha sido eliminada`})
    })
  })
}

module.exports = {
  getCategory,
  getCategoryByMenu,
  getCategories,
  saveCategory,
  updateCategory,
  deleteCategory,
  getCategoryWithMenu
}