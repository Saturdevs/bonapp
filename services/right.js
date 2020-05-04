'use strict'

const RightDAO = require('../dataAccess/right');

/**
 * @description Devuelve todo los permisos guardados en la base de datos.
 */
async function getAll() { 
  try {
    return await RightDAO.getRightsSortedByQuery({});
  } catch (err) {
    throw new Error(err);    
  }
}

/**
 * @description Devuelve todos los permisos almacenados en la base de datos que cumplan
 * con la query dada como parámetro.
 * @param {*} urlPathColection nombre de la coleccion para la que se quiere obtener el permiso.
 * @param {*} routePath path de la ruta para la que se quiere obtener el permiso.
 * @param {*} httpMethod metodo http para el que se quiere obtener el permiso.
 * @returns permisos que cumplen con la qeuery dada.
 */
async function getRightsByColectionAndMethod(urlPathColection, routePath, httpMethod) { 
  try {
    let query = { urlPathColection: urlPathColection, routePath: routePath, httpMethod: httpMethod }
    let rights = await RightDAO.getRightsSortedByQuery(query);
    return rights[0];
  } catch (err) {
    throw new Error(err);    
  }
}

/**
 * @description Devuelve los permisos que pertenecen al grupo dado como parámetro.
 * @param {String} groupName nombre del grupo del que se quieren obtener los permisos.
 * @returns permisos que pertenecen al grupo dado como parámetro
 */
async function getRightsByGroup(groupName) { 
  try {
    let query = { group: groupName };
    return await RightDAO.getRightsSortedByQuery(query);
  } catch (err) {
    throw new Error(err);    
  }
}

module.exports = {
  getAll,
  getRightsByColectionAndMethod,
  getRightsByGroup
}