'use strict'

const UserRole = require('../models/userRole');

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Recupera los roles de usuario de la base de datos según la query dada
 * y ordenados según la condición dada o por nombre si no se dió ninguna.
 * @param {JSON} query 
 * @param {JSON} sortCondition condiciones para ordenar los resultados.
 * @returns userRoles recuperados de la base de datos que cumplen con la query dada.
 */
async function getAllUserRolesByQuerySorted(query, projection = {}, sortCondition = { name: 1 }) {
  try {
    return await UserRole.find(query, projection).sort(sortCondition);
  } catch (err) {
    handleUserRoleError(err);
  }
}

/**
 * @description Recupera de la base de datos el rol de usuario con id igual al dado como parámetro.
 * @param {*} userRoleId id del rol de usuario que se quiere recuperar de la base de datos.
 * @returns userRole recuperado de la bd.
 */
async function getUserRoleById(userRoleId) {
  try {
    if (userRoleId === null || userRoleId === undefined) {
      throw new Error('El id del rol de usuario que se quiere recuperar de la base de datos no puede ser nulo');
    }

    return await UserRole.findById(userRoleId);
  }
  catch (err) {
    handleUserRoleError(err);
  }
}

/**
 * @description Actualiza el rol de usuario con id igual al como parámetro en la base de datos.
 * @param {String} userRoleId id del rol de usuario a actualizar en la base de datos.
 * @param {JSON} bodyUpdate propiedades del rol de usuario que se quieren actualizar.
 * @returns userRole actualizado en la base de datos
 */
async function updateUserRoleById(userRoleId, bodyUpdate, opts = { new: true }) {
  try {
    if (userRoleId === null || userRoleId === undefined) {
      throw new Error('El id del rol de usuario que se quiere actualizar no puede ser nulo');
    }

    return await UserRole.findByIdAndUpdate(userRoleId, bodyUpdate, opts);    
  } catch (err) {
    handleUserRoleError(err);
  }
}

/**
 * @description Guarda el rol de usuario dado como parámetro en la base de datos
 * @param {UserRole} userRole
 * @param {JSON} opts
 */
async function save(userRole, opts = {}) {
  try {
    return await userRole.save(opts);    
  } catch (err) {
    handleUserRoleError(err);
  }
}

/**
 * @description Elmina el rol de usuario dado como parámetro en la base de datos.
 * @param {UserRole} userRole
 * @param {JSON} opts
 */
async function remove(userRole, opts = {}) {
  try {
    if (userRole === null || userRole === undefined) {
      throw new Error('El rol de usuario que se quiere eliminar de la base de datos no puede ser nulo');
    }

    await userRole.remove(opts);
  } catch (err) {
    handleTableError(err);
  }
}

function handleUserRoleError(err) {
  if (err.code === 11000) {
    if (err.keyPattern.name !== null && err.keyPattern.name !== undefined) {
      throw new Error(`Ya existe un rol de usuario con ese NOMBRE. Ingrese uno distinto por favor.`);
    } else {
      throw new Error(err.message);
    }
  } else {
    throw new Error(err.message);
  }
}

module.exports = {
  getAllUserRolesByQuerySorted,
  getUserRoleById,
  updateUserRoleById,
  save,
  remove
}