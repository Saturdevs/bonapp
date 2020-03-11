'use strict'

const AppMenuDAO = require('../dataAccess/appMenu');

/**
 * @description Devuelve los menus raíces de la app. Son los que se muestran en la navbar y no 
 * tienen ningún padre.
 * @returns menus que no tienen un padre.
 */
async function retrieveRootMenus() {
  try {
    let query = { parent: null };
    let sortCondition = { order: 1 };
    return await AppMenuDAO.getAppMenusSortedByQuery(query, sortCondition);
  } catch (err) {
    throw new Error(err);    
  }
}

/**
 * @description Devuelve los menús hijos del menú con id igual al dado como parámetro.
 * @param {String} parentId id del menú del que se quieren obtener los menús hijos
 * @returns menús hijos del menú con id igual al dado como paráetro
 */
async function retrieveMenusByParent(parentId) { 
  try {
    let query = { parent: parentId };
    let sortCondition = { order: 1 };
    return await AppMenuDAO.getAppMenusSortedByQuery(query, sortCondition);
  } catch (err) {
    throw new Error(err);    
  }
}

module.exports = {
  retrieveRootMenus,
  retrieveMenusByParent
}