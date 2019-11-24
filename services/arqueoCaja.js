'use strict'

const Arqueo = require('../models/arqueoCaja');
const ArqueoTransform = require('../transformers/arqueoCaja');

/**
 * Devuelve el arqueo con id igual al dado como parametro
 * @param {*} arqueoId id del arqueo que se quiere recuperar.
 */
async function getArqueo(arqueoId) {
  try {
    let arqueo = await getArqueoById(arqueoId);

    return ArqueoTransform.transformToBusinessObject(arqueo);
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Devuelve todos los arqueos no eliminados. deleted = false.
 */
async function getNotDeletedArqueos() {
  try {
    let arqueosReturned = [];
    let query = { deleted: false };
    let arqueos = await getArqueoByQuery(query);    

    for (let i = 0; i < arqueos.length; i++) {
      const arqueoTransformed = await ArqueoTransform.transformToBusinessObject(arqueos[i]);
      arqueosReturned.push(arqueoTransformed);
    }

    return arqueosReturned;
  } catch (err) {
    throw new Error(err);    
  }
}

/**
 * Obtiene el arqueo abierto para la caja registradora dada como parámetro si lo hay.
 * @param {*} cashRegisterId id de la caja registradora
 */
async function getArqueoOpenByCashRegister(cashRegisterId) {
  try {
    let query = { cashRegisterId: cashRegisterId, closedAt: null, deleted: false };
    let arqueoOpen = await getArqueoByQuery(query);

    return arqueoOpen[0];
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Obtiene el último arqueo para la caja registradora dada como parámetro si existe.
 * @param {*} cashRegisterId 
 */
async function getLastArqueoByCashRegister(cashRegisterId) {
  try {
    let query = { cashRegisterId: cashRegisterId, deleted: false };
    let sortCondition = { closedAt: -1 };

    let arqueos = await getArqueoSortByQuery(query, sortCondition);

    return arqueos[0];
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Recupera un unico arqueo con cashRegisterId igual al dado como parametro. Si hay mas de uno
 * devuelve el primero que encuentra.
 * @param {string} cashRegisterId 
 * @returns primer arqueo encontrado con cashRegisterId igual al dado como parametro.
 */
async function retrieveOneCashCountForCashRegister(cashRegisterId) {
  try {
    let query = { cashRegisterId: cashRegisterId };
    let cashCount = await getOneCashCountByQuery(query);
    
    return cashCount;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Actualiza el arqueo con id igual al dado como parametro en la base de datos.
 * @param {ObjectId} arqueoId 
 * @param {JSON} bodyUpdate 
 * @param {JSON} opts
 */
async function update(arqueoId, bodyUpdate, opts = {}) {
  try {
    if (arqueoId === null || arqueoId === undefined ||
        bodyUpdate === null || bodyUpdate === undefined) {
          throw new Error("El arqueo a actualizar no puede ser nulo");
        }
    let arqueoUpdated = await updateArqueoById(arqueoId, bodyUpdate, opts);
    return ArqueoTransform.transformToBusinessObject(arqueoUpdated);
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Elimina el arqueo con id igual al dado como parametro de la base de datos.
 * @param {ObjectID} arqueoId id del arqueo que se quiere eliminar
 */
async function deleteArqueo(arqueoId) {
  try {
    let arqueo = await getArqueoById(arqueoId);
    arqueo.remove();
  } catch (err) {
    throw new Error(err);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Recupera de la base de datos el arqueo con id igual al dado como parametro
 * @param {*} arqueoId id del arqueo que se quiere recuperar de la base de datos
 */
async function getArqueoById(arqueoId) {
  try {
    let arqueo = await Arqueo.findById(arqueoId);
    return arqueo;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Recupera el arqueo de la base de datos según la query dada.
 * @param {JSON} query 
 */
async function getArqueoByQuery(query) {
  try {
    let arqueos = await Arqueo.find(query);
    return arqueos;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Recupera el/los arqueo/s de la base de datos segun la query dada y ordenados por la condicion dada
 * @param {JSON} query query para realizar la busqueda
 * @param {JSON} sortCondition condiciones para ordenar los resultados
 */
async function getArqueoSortByQuery(query, sortCondition) {
  try {
    let arqueos = await Arqueo.find(query).sort(sortCondition);
    return arqueos;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Recupera un unico arqueo que cumpla con la query dada como parametro. Si hay mas de uno devuelve el primero
 * encuentra.
 * @param {JSON} query 
 * @returns primer arqueo encontrado que cumple con la query dada.
 */
async function getOneCashCountByQuery(query) {
  try {
    let cashCount = await Arqueo.findOne(query);
    return cashCount;
  }
  catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Updetea el arqueo en la base de datos segun el id dado.
 * @param {ObjectID} arqueoId 
 * @param {JSON} bodyUpdate 
 * @param {JSON} opts
 */
async function updateArqueoById(arqueoId, bodyUpdate, opts = {}) {
  try {
    let arqueoUpdated = await Arqueo.findByIdAndUpdate(arqueoId, bodyUpdate, opts);
    return arqueoUpdated;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Guarda el arqueo dado como parametro en la base de datos
 * @param {Arqueo} arqueo 
 */
async function save(arqueo) {
  try {
    let arqueoSaved = await arqueo.save(arqueo);
    return arqueoSaved;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  getArqueo,
  getNotDeletedArqueos,
  getArqueoOpenByCashRegister,
  getLastArqueoByCashRegister,
  retrieveOneCashCountForCashRegister,
  deleteArqueo,
  save,
  update
}