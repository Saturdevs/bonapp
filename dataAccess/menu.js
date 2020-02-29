'use strict'

const Menu = require('../models/menu');

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Recupera los menus ordenados de la base de datos según la query y la condición de orden dadas.
 * @param {JSON} query query para realizar la busqueda
 * @param {JSON} sortCondition condiciones para ordenar los resultados
 */
async function getMenusSortedByQuery(query, sortCondition) {
  try {
    let menus = await Menu.find(query).sort(sortCondition);
    return menus;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Recupera de la base de datos el menú con id igual al dado como parámetro.
 * @param {*} menuId id del menú que se quiere recuperar de la base de datos.
 */
async function getMenuById(menuId) {
  try {
    if (menuId === null || menuId === undefined) {
      throw new Error('El id de la carta que se quiere recuperar de la base de datos no puede ser nulo');
    }

    let menu = await Menu.findById(menuId);
    return menu;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Guarda el menú dado como parámetro en la base de datos
 * @param {Menu} menu
 */
async function save(menu) {
  try {
    if (menu === null || menu === undefined) {
      throw new Error('La carta que se quiere guardar en la base de datos no puede ser nula');
    }

    let menuSaved = await menu.save();
    return menuSaved;
  } catch (err) {
    if (err.code === 11000) {
      throw new Error(`Ya existe una carta con ese nombre. Ingrese uno distinto por favor.`);
    } else {
      throw new Error(err);
    }
  }
}

/**
 * @description Elmina el menu dado como parametro de la base de datos.
 * @param {Menu} menu
 */
async function remove(menu) {
  try {
    await menu.remove();
  } catch (err) {
    throw new Error(err.message);
  }
}

async function updateMenuyById(menuId, bodyUpdate, opts  = { new: true }) {
  try {
    if (menuId === null || menuId === undefined) {
      throw new Error('El id del menu que se quiere actualizar no puede ser nulo');
    }
    let menuUpdated = await Menu.findByIdAndUpdate(menuId, bodyUpdate, opts);
    return menuUpdated;
  } catch (err) {
    if (err.code === 11000) {
      throw new Error(`Ya existe un menu con ese nombre. Ingrese uno distinto por favor.`);
    } else {
      throw new Error(err);
    }
  }
}

module.exports = {
  getMenusSortedByQuery,
  getMenuById,
  save,
  remove,
  updateMenuyById
}