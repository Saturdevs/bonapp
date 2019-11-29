'use strict'

const CategoryDAO = require('../dataAccess/category');
const MenuDAO = require('../dataAccess/menu');

async function getAll() {
  try {
    let sortCondition = { name: 1 };
    let menus = await MenuDAO.getMenusSortedByQuery({}, sortCondition);

    return menus;
  } catch (err) {
    throw new Error(err.message);
  }
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

    return menu;
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

  return menuSaved;
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

module.exports = {
  getAll,
  getMenu,
  hasAtLeastOneCategory,
  saveMenu,
  deleteMenu
}