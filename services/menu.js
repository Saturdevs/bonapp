'use strict'

const Menu = require('../models/menu');


//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Recupera de la base de datos el menu con id igual al dado como parametro
 * @param {string} menuId id del menu que se quiere recuperar de la base de datos
 */
async function getMenuById(menuId) {
  try {
    let menu = await Menu.findById(menuId);
    return menu;
  }
  catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  getMenuById
}