'use strict'
const User = require('../models/user');

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

async function getUserById(userId) {
  try {
    let user = await User.findById(userId).select('-password -salt');
    return user;
  }
  catch (err) {
    handleUserError(err);
  }
}

async function getFullUserById(userId) {
  try {
    let user = await User.findById(userId);
    return user;
  }
  catch (err) {
    handleUserError(err);
  }
}

/**
 * @description Recupera el usuario que cumpla con la query dada como parámetro. Si hay mas de uno devuelve 
 * el primero encuentra.
 * @param {JSON} query 
 */
async function getUserByQuery(query) {
  try {
    let user = await User.findOne(query).select('-salt');
    return user;
  }
  catch (err) {
    handleUserError(err);
  }
}

/**
 * Recupera los usuarios ordenados de la base de datos según la query y la condición de orden dadas.
 * @param {JSON} query query para realizar la busqueda
 * @param {JSON} sortCondition condiciones para ordenar los resultados
 */
async function getUsersSortedByQuery(query, sortCondition = {}) {
  try {
    return await User.find(query).select('-password -salt').sort(sortCondition);
  }
  catch (err) {
    handleUserError(err);
  }
}

/**
 * @description Guarda el usuario dado como parámetro en la base de datos.
 * @param {User} user
 */
async function save(user) {
  try {
    if (user === null || user === undefined) {
      throw new Error('El usuario que se quiere guardar en la base de datos no puede ser nulo');
    }

    return await user.save();
  } catch (err) {
    handleUserError(err);
  }
}

/**
 * @description Elmina el usuario dado como parámetro de la base de datos.
 * @param {User} user
 * @param {JSON} opts
 */
async function remove(user, opts = {}) {
  try {
    if (user === null || user === undefined) {
      throw new Error('El usuario que se quiere eliminar de la base de datos no puede ser nulo');
    }

    await user.remove(opts);
  } catch (err) {
    handleUserError(err);
  }
}

/**
 * @description Elmina el usuario dado como parámetro de la base de datos.
 * @param {User} user
 * @param {JSON} opts
 */
async function updateUserById(userId, bodyUpdate) {
  try {
    if (userId === null || userId === undefined) {
      throw new Error('El id del usuario que se quiere actualizar no puede ser nulo');
    }
    return await User.findByIdAndUpdate(userId, bodyUpdate);
  } catch (err) {
    return err;
  }
}

function handleUserError(err) {
  if (err.code === 11000) {
    if (err.keyPattern.username !== null && err.keyPattern.username !== undefined) {
      throw new Error(`Ya existe un usuario con ese nombre de usuario. Ingrese uno distinto por favor.`);
    } else {
      throw new Error(err.message);
    }
  } else {
    throw new Error(err.message);
  }
}

module.exports = {
  getUserById,
  getUserByQuery,
  getUsersSortedByQuery,
  save,
  remove,
  getFullUserById,
  updateUserById
}