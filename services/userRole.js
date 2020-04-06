'use strict'

const UserRoleDAO = require('../dataAccess/userRole');

/**
 * @description Devuelve todos los roles de usuario almacenados en la base de datos
 * sin el atributo de permisos (rigths) ordenados por nombre.
 * @returns userRoles recuperados de la bd.
 */
async function getAllUserRolesWithoutRights() {
  try {
    let projection = { rights: 0 };
    return await UserRoleDAO.getAllUserRolesByQuerySorted({}, projection);    
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Devuelve el rol de usuario con id igual al dado como parámetro.
 * @param {string} userRoleId id del rol de usuario que se quiere recuperar.
 * @returns userRole recuperado de la base de datos.
 */
async function getUserRole(userRoleId) {
  try {
    if (userRoleId === null || userRoleId === undefined) {
      throw new Error('Se debe especificar el id del rol de usuario que se quiere obtener de la base de datos');
    }

    return await UserRoleDAO.getUserRoleById(userRoleId);
  }
  catch (err) {
    throw new Error(err);
  }
}

async function getAllUserRoles(){
  try {
    let query = {};
    return await UserRoleDAO.getAllUserRolesByQuerySorted(query);
  }
  catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  getAllUserRolesWithoutRights,
  getUserRole,
  getAllUserRoles
}