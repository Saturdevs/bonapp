'use strict'

const CashRegister = require('../models/cashRegister');

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Recupera de la base de datos la caja registradora con id igual al dado como parametro.
 * @param {*} cashRegisterId id de la caja registradora que se quiere recuperar de la base de datos.
 * @returns cashRegister recuperada de la base de datos.
 */
async function getCashRegisterById(cashRegisterId) {
  try {
    if (cashRegisterId === null || cashRegisterId === undefined) {
      throw new Error('El id de la caja registradora que se quiere recuperar de la base de datos no puede ser nulo');
    }

    let cashRegister = await CashRegister.findById(cashRegisterId);
    return cashRegister;
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
async function getCashRegisterByQuery(query) {
  try {
    let cashRegisters = await CashRegister.find(query);
    return cashRegisters;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Guarda la caja registradora dada como parametro en la base de datos
 * @param {CashRegister} cashRegister
 */
async function save(cashRegister) {
  try {
    if (cashRegister === null || cashRegister === undefined) {
      throw new Error('La caja registradora que se quiere guardar en la base de datos no puede ser nula');
    }

    let cashRegisterSaved = await cashRegister.save(cashRegister);
    return cashRegisterSaved;
  } catch (err) {
    if (err.code === 11000) {
      throw new Error(`Ya existe una caja con ese nombre. Ingrese uno distinto por favor.`);
    } else {
      throw new Error(err);
    }
  }
}

/**
 * Updetea la caja registradora en la base de datos segun el id dado.
 * @param {ObjectID} cashRegisterId 
 * @param {JSON} bodyUpdate 
 */
async function updateCashRegisterById(cashRegisterId, bodyUpdate) {
  try {
    if (cashRegisterId === null || cashRegisterId === undefined) {
      throw new Error('El id de la caja registradora que se quiere actualizar no puede ser nulo');
    }
    
    let cashRegisterUpdated = await CashRegister.findByIdAndUpdate(cashRegisterId, bodyUpdate, { new: true });
    return cashRegisterUpdated;
  } catch (err) {
    if (err['code'] == 11000) {
      throw new Error(`Ya existe una caja con ese nombre. Ingrese otro nombre.`);
    } else {
      throw new Error(err);
    }
  }
}

/**
 * @description Actualiza todas las propiedades dadas como parametro en todas las cash registers que cumplan con la query dada
 * @param {JSON} query query que determina que cash registers actualizar
 * @param {JSON} propertiesToSet propiedades a actualizar
 * @returns las cash registers actualizadas
 */
async function updateManyByQuery(query, propertiesToSet) {
  try {
    await CashRegister.updateMany(query, propertiesToSet);
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Elimina la cashRegister dada como parametro en la base de datos.
 * @param {CashRegister} cashRegister 
 */
async function removeCashRegister(cashRegister) {
  try {
    if (cashRegister === null || cashRegister === undefined) {
      throw new Error('La caja registradora que se quiere eliminar de la base de datos no puede ser nula');
    }

    await cashRegister.remove();
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  getCashRegisterById,
  getCashRegisterByQuery,
  save,
  updateCashRegisterById,
  updateManyByQuery,
  removeCashRegister
}