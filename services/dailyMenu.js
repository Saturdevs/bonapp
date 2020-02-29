'use strict'

const DailyMenu = require('../models/dailyMenu');
const DailyMenuDAO = require('../dataAccess/dailyMenu');
/**
 * @description Recupera todas las cajas registradoras de la base de datos.
 * @returns cashRegisters
 */
async function getAll() {
  try {
    let dailyMenusToReturn = [];
    let query = {};
    let dailyMenus = await DailyMenuDAO.getDailyMenuByQuery(query);

    // for (let i = 0; i < dailyMenus.length; i++) {
    //   const cashRegisterransformed = await CashRegisterTransform.transformToBusinessObject(cashRegisters[i]);
    //   cashRegistersToReturn.push(cashRegisterransformed);
    // }

    return dailyMenus;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Recupera todas las cajas registradoras habilitadas de la base de datos.
 * @returns cashRegisters
 */
async function getAvailableDailyMenus() {
  try {
    let dailyMenusToReturn = [];
    let query = { available: true };
    let dailyMenus = await DailyMenuDAO.getDailyMenuByQuery(query);

    // for (let i = 0; i < cashRegisters.length; i++) {
    //   const cashRegisterransformed = await CashRegisterTransform.transformToBusinessObject(cashRegisters[i]);
    //   cashRegistersToReturn.push(cashRegisterransformed);
    // }

    return dailyMenus;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Devuelve la caja registradora con id igual al dado como parametro.
 * @param {*} cashRegisterId id de la caja registradora que se quiere recuperar.
 * @returns cashRegister recuperada de la base de datos con id igual al dado como parámetro.
 */
async function getDailyMenu(dailyMenuId) {
  try {
    let dailyMenu = await DailyMenuDAO.getDailyMenuById(dailyMenuId);

    return dailyMenu;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Crea una nueva caja registradora con los datos dados como parametros y la guarda en la base de datos.
 * @param {JSON} reqBody request body.
 * @returns cashRegister guardada en la base de datos.
 */
async function saveDailyMenu(reqBody) {
  let dailyMenuSaved = await DailyMenuDAO.save(reqBody);

  return dailyMenuSaved;
}

/**
 * Actualiza la caja registradora con id igual al dado como parametro en la base de datos.
 * @param {ObjectId} dailyMenuId 
 * @param {JSON} dataToUpdate 
 */
async function update(dailyMenuId, dataToUpdate) {
  try {    
    if (dailyMenuId === null || dailyMenuId === undefined ||
      dataToUpdate === null || dataToUpdate === undefined) {
      throw new Error("El menu del dia a actualizar no puede ser nula");
    }

    let dailyMenuStored = await DailyMenuDAO.getDailyMenuById(dailyMenuId);

    let dailyMenuUpdated = await DailyMenuDAO.updateDailyMenuById(dailyMenuId, dataToUpdate);
    return dailyMenuUpdated;
  } catch (err) {
    throw new Error(err.message);
  }
}


module.exports = {
  getAll,
  getAvailableDailyMenus,
  getDailyMenu,
  saveDailyMenu,
  update
}