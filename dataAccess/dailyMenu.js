'use strict'

const DailyMenu = require('../models/dailyMenu');

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Recupera de la base de datos la caja registradora con id igual al dado como parametro.
 * @param {*} cashRegisterId id de la caja registradora que se quiere recuperar de la base de datos.
 * @returns cashRegister recuperada de la base de datos.
 */
async function getDailyMenuById(dailyMenuId) {
  try {
    if (dailyMenuId === null || dailyMenuId === undefined) {
      throw new Error('El id del menu del dia que se quiere recuperar de la base de datos no puede ser nulo');
    }

    let dailyMenu = await DailyMenu.findById(dailyMenuId);
    return dailyMenu;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Recupera la caja registradora de la base de datos según la query dada.
 * @param {JSON} query 
 * @returns caja registradoras recuperados de la base de datos que cumplen con la query dada
 */
async function getDailyMenuByQuery(query) {
  try {
    let dailyMenu = await DailyMenu.find(query);
    return dailyMenu;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Guarda la caja registradora dada como parametro en la base de datos
 * @param {DailyMenu} dailyMenu
 */
async function save(dailyMenu) {
  try {
    if (dailyMenu === null || dailyMenu === undefined) {
      throw new Error('El menu del dia que se quiere guardar en la base de datos no puede ser nula');
    }

    let dailyMenuSaved = await DailyMenu.create(dailyMenu);
    return dailyMenuSaved;
  } catch (err) {
    if (err.code === 11000) {
      throw new Error(`Ya existe un menu del dia con ese nombre. Ingrese uno distinto por favor.`);
    } else {
      throw new Error(err);
    }
  }
}

/**
 * Updetea la caja registradora en la base de datos segun el id dado.
 * @param {ObjectID} dailyMenuId 
 * @param {JSON} bodyUpdate 
 */
async function updateDailyMenuById(dailyMenuId, bodyUpdate) {
  try {
    if (dailyMenuId === null || dailyMenuId === undefined) {
      throw new Error('El id del menu del dia que se quiere actualizar no puede ser nulo');
    }
    
    let dailyMenuUpdated = await DailyMenu.findByIdAndUpdate(dailyMenuId, bodyUpdate, { new: true });
    return dailyMenuUpdated;
  } catch (err) {
    if (err['code'] == 11000) {
      throw new Error(`Ya existe un menu del dia con ese nombre. Ingrese otro nombre.`);
    } else {
      throw new Error(err);
    }
  }
}

module.exports = {
  getDailyMenuById,
  getDailyMenuByQuery,
  save,
  updateDailyMenuById
}