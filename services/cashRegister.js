'use strict'

const CashRegister = require('../models/cashRegister');
const CashRegisterDAO = require('../dataAccess/cashRegister');
const CashRegisterTransform = require('../transformers/cashRegister');

/**
 * @description Recupera todas las cajas registradoras de la base de datos.
 * @returns cashRegisters
 */
async function getAll() {
  try {
    let cashRegistersToReturn = [];
    let query = {};
    let cashRegisters = await CashRegisterDAO.getCashRegisterByQuery(query);

    for (let i = 0; i < cashRegisters.length; i++) {
      const cashRegisterransformed = await CashRegisterTransform.transformToBusinessObject(cashRegisters[i]);
      cashRegistersToReturn.push(cashRegisterransformed);
    }

    return cashRegistersToReturn;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Recupera todas las cajas registradoras habilitadas de la base de datos.
 * @returns cashRegisters
 */
async function getAvailableCashRegisters() {
  try {
    let cashRegistersToReturn = [];
    let query = { available: true };
    let cashRegisters = await CashRegisterDAO.getCashRegisterByQuery(query);

    for (let i = 0; i < cashRegisters.length; i++) {
      const cashRegisterransformed = await CashRegisterTransform.transformToBusinessObject(cashRegisters[i]);
      cashRegistersToReturn.push(cashRegisterransformed);
    }

    return cashRegistersToReturn;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Devuelve la caja registradora con id igual al dado como parametro.
 * @param {*} cashRegisterId id de la caja registradora que se quiere recuperar.
 * @returns cashRegister recuperada de la base de datos con id igual al dado como parámetro.
 */
async function getCashRegister(cashRegisterId) {
  try {
    let cashRegister = await CashRegisterDAO.getCashRegisterById(cashRegisterId);

    return CashRegisterTransform.transformToBusinessObject(cashRegister);
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
async function saveCashRegister(reqBody) {
  let cashRegister = createCashRegister(reqBody.name, false);
  let cashRegisterSaved = await CashRegisterDAO.save(cashRegister);

  return CashRegisterTransform.transformToBusinessObject(cashRegisterSaved);
}

/**
 * @description Crea una nueva cashRegister con los datos dados como parámetros.
 * @param {String} name nombre de la caja registradora.
 * @param {Boolean} defaultcr true si es la caja registradora por default. false si no lo es.
 */
function createCashRegister(name, defaultcr) {
  let cashRegister = new CashRegister();
  cashRegister.name = name;
  cashRegister.available = true;
  cashRegister.default = defaultcr;

  return cashRegister;
}

/**
 * Actualiza la caja registradora con id igual al dado como parametro en la base de datos.
 * @param {ObjectId} cashRegisterId 
 * @param {JSON} dataToUpdate 
 */
async function update(cashRegisterId, dataToUpdate) {
  let cashRegisterDefault;
  try {    
    if (cashRegisterId === null || cashRegisterId === undefined ||
      dataToUpdate === null || dataToUpdate === undefined) {
      throw new Error("La caja registradora a actualizar no puede ser nula");
    }

    //Si la propiedad por default es true busco el valor almacenado en la bd para la caja registradora
    if (dataToUpdate.default !== null && dataToUpdate.default !== undefined && dataToUpdate.default === true) {
      let cashRegisterStored = await CashRegisterDAO.getCashRegisterById(cashRegisterId);

      //Si la propiedad del objeto en la base de dato es false quiere decir que se quiere actualizar a true 
      //(cambiar la caja registradora por defecto) por lo que se deben unsetear todas las cajas registradoras
      //por defecto hasta el momento (deberia haber solo una)
      if (cashRegisterStored.default === false) {
        cashRegisterDefault = await CashRegisterDAO.getCashRegisterByQuery({ default: true });
        if (cashRegisterDefault !== null && cashRegisterDefault !== undefined) {
          await unSetDefaultCashRegister();
        }
      }
    }

    let cashRegisterUpdated = await CashRegisterDAO.updateCashRegisterById(cashRegisterId, dataToUpdate);
    return CashRegisterTransform.transformToBusinessObject(cashRegisterUpdated);
  } catch (err) {
    //Si el update de la caja registradora falla, pero el unset de las cajas registradoras por defecto se hizo bien
    //volver a actualizar la caja registradora por defecto a la que era antes
    if (cashRegisterDefault !== null && cashRegisterDefault !== undefined) {
      await CashRegisterDAO.updateCashRegisterById(cashRegisterDefault[0]._id, { default: true });
    }
    throw new Error(err.message);
  }
}

/**
 * @description Cambia todas las cajas registradoras por defecto (default = true) a cajas no por defecto (default = false).
 * Debería haber solo una caja por defecto, se actualizan todas por las dudas.
 */
async function unSetDefaultCashRegister() {
  let query = { default: true };
  let propertiesToSet = { $set: { default: false } };

  await CashRegisterDAO.updateManyByQuery(query, propertiesToSet);  
}

/**
 * @description Elimina la cashRegister con id igual al dado como parametro de la base de datos.
 * @param {ObjectID} cashRegisterId id de la cashRegister que se quiere eliminar
 */
async function deleteCashRegister(cashRegisterId) {
  try {
    let cashRegister = await CashRegisterDAO.getCashRegisterById(cashRegisterId);
    await CashRegisterDAO.removeCashRegister(cashRegister);
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  getAll,
  getAvailableCashRegisters,
  getCashRegister,
  saveCashRegister,
  update,
  deleteCashRegister
}