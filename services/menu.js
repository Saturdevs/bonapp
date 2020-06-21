'use strict'

const mongoose = require('mongoose');
const CategoryDAO = require('../dataAccess/category');
const MenuTransform = require('../transformers/menu');
const MenuDAO = require('../dataAccess/menu');
const ProductDAO = require('../dataAccess/product');
const CategoryService = require('./category');

async function getAll() {
  try {
    let menusToReturn = [];
    let sortCondition = { name: 1 };
    let menus = await MenuDAO.getMenusSortedByQuery({}, sortCondition);

    if (menus !== null && menus !== undefined) {
      for (let i = 0; i < menus.length; i++) {
        const menuTransformed = await MenuTransform.transformToBusinessObject(menus[i]);
        menusToReturn.push(menuTransformed);
      }
    }

    return menusToReturn;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getAllAvailables() {
  try {
    let menusToReturn = [];
    let sortCondition = { name: 1 };
    let menus = await getMenusWithCategoriesAndProducts(await MenuDAO.getMenusSortedByQuery({ available: true }, sortCondition));

    if (menus !== null && menus !== undefined) {
      for (let i = 0; i < menus.length; i++) {
        const menuTransformed = await MenuTransform.transformToBusinessObject(menus[i]);
        menusToReturn.push(menuTransformed);
      }
    }

    return menusToReturn;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Devuelve aquellos menus del array dado como parámetro que tienen categorias asociadas, y que a su vez 
 * esas categorías tienen productos asociados.
 * @param {Menu[]} menus 
 * @returns {menus[]} menus que tienen categorías asociadas.
 */
async function getMenusWithCategoriesAndProducts(menus) {    
  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i];    
    const categories = await CategoryService.getCategoriesAvailablesByMenu(menu._id);
    if (!categories || categories.length === 0) {
      menus.splice(i, 1);
      i--;
    }
  }

  return menus;
}

/**
 * Devuelve el menú con id igual al dado como parámetro
 * @param {string} menuId id de la categoría que se quiere recuperar.
 */
async function getMenu(menuId) {
  try {
    let menu = null;
    if (menuId === null || menuId === undefined) {
      throw new Error('Se debe especificar el id de la carta que se quiere obtener de la base de datos');
    }

    menu = await MenuDAO.getMenuById(menuId);

    let menuToReturn = await MenuTransform.transformToBusinessObject(menu);

    return menuToReturn;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Recupera de la base de datos la primera categoría que se encuentre para la cual 
 * el menu sea el menu dado como parámetro como parámetro.
 * @param {string} menuId 
 * @returns la categoría que se encuentra para el menu dado.
 */
async function hasAtLeastOneCategory(menuId) {
  try {
    let query = { menuId: menuId };
    let category = await CategoryDAO.getOneCategoryByQuery(query);

    return category;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Crea un nuevo menú con los datos dados como parametros y lo guarda en la base de datos.
 * @param {Menu} menu
 * @returns menu guardado en la base de datos.
 */
async function saveMenu(menu) {
  let menuSaved = await MenuDAO.save(menu);

  let menuToReturn = await MenuTransform.transformToBusinessObject(menuSaved);

  return menuToReturn;
}

/**
 * @description Elimina el menu con id igual al dado como parametro de la base de datos.
 * @param {String} menuId id del menu que se quiere eliminar
 */
async function deleteMenu(menuId) {
  try {
    let menu = await MenuDAO.getMenuById(menuId);
    await MenuDAO.remove(menu);
  } catch (err) {
    throw new Error(err.message);
  }
}

async function disableMenuAndCategoriesAndProducts(menuId) {
  // Transaccion que inhabilita el menu, sus categorias asociadas y los productos asociados a dicha categoria.
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    const opts = { session: session, new: true, multi: true };
    await MenuDAO.updateMenuyById(menuId, {available: false}, opts);

    let categories = await CategoryService.getCategoriesByMenu(menuId);

    for (let i = 0; i < categories.length; i++) {
      let categoryUpdated = await CategoryDAO.updateCategoryById(categories[i]._id, {available: false}, opts);
      let productsUpdated = await ProductDAO.updateManyProductsByQuery({category: categories[i]._id}, { available: false }, opts);
    }   

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error.message);
  }
}

module.exports = {
  getAll,
  getAllAvailables,
  getMenu,
  hasAtLeastOneCategory,
  saveMenu,
  deleteMenu,
  disableMenuAndCategoriesAndProducts
}