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
  getRightsByGroup
}