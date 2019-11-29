'use strict'

const Category = require('../models/category')
const CategoryService = require('../services/category');
const HttpStatus = require('http-status-codes');

async function getCategories(req, res) {
  try {
    let categories = await CategoryService.getAll();

    if (categories !== null && categories !== undefined) {
      res.status(HttpStatus.OK).send({ categories });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen cateogrías registradas en la base de datos.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getCategory(req, res) {
  try {
    let categoryId = req.params.categoryId;
    let category = await CategoryService.getCategory(categoryId);

    if (category !== null && category !== undefined) {
      res.status(HttpStatus.OK).send({ category });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `La categoría ${categoryId} no existe en la base da datos` });
    }
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getCategoryByMenu(req, res) {
  try {
    let menuId = req.params.menuId;
    let categories = await CategoryService.getCategoriesByMenu(menuId);

    if (categories !== null && categories !== undefined) {
      res.status(HttpStatus.OK).send({ categories });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen cateogrías registradas en la base de datos para el menu seleccionado.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function hasAtLeastOneProduct(req, res) {
  try {
    let categoryId = req.params.categoryId;
    let product = await CategoryService.hasAtLeastOneProduct(categoryId);

    res.status(HttpStatus.OK).send({ product: product });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function saveCategory(req, res) {
  try {
    let category = new Category()
    category.name = req.body.name
    category.menuId = req.body.menu._id
    category.picture = req.body.picture

    let categoryrSaved = await CategoryService.saveCategory(category);

    res.status(HttpStatus.OK).send({ category: categoryrSaved });
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

async function updateCategory(req, res) {
  try {
    let categoryId = req.params.categoryId
    let bodyUpdate = req.body

    let categoryUpdated = await CategoryService.update(categoryId, bodyUpdate);
    res.status(HttpStatus.OK).send({ category: categoryUpdated });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer actualizar la categoría: ${err.message}.` });
  }
}

async function deleteCategory(req, res) {
  try {
    let categoryId = req.params.categoryId
    CategoryService.deleteCategory(categoryId);
    res.status(HttpStatus.OK).send({ message: `La categoría ha sido eliminada de la base de datos correctamente.` });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer borrar la categoría de la base de datos: ${err.message}` })
  }
}

module.exports = {
  getCategory,
  getCategoryByMenu,
  getCategories,
  saveCategory,
  updateCategory,
  deleteCategory,
  hasAtLeastOneProduct
}