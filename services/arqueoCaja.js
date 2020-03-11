'use strict'

const ArqueoDAO = require('../dataAccess/arqueoCaja');
const ArqueoTransform = require('../transformers/arqueoCaja');

/**
 * Devuelve el arqueo con id igual al dado como parametro
 * @param {*} arqueoId id del arqueo que se quiere recuperar.
 */
async function getArqueo(arqueoId) {
  try {
    let arqueo = await ArqueoDAO.getArqueoById(arqueoId);

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
    let arqueos = await ArqueoDAO.getArqueoByQuery(query);    

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
    let arqueoOpen = await ArqueoDAO.getArqueoByQuery(query);

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

    let arqueos = await ArqueoDAO.getArqueoSortByQuery(query, sortCondition);

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
    let cashCount = await ArqueoDAO.getOneCashCountByQuery(query);
    
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
    let arqueoUpdated = await ArqueoDAO.updateArqueoById(arqueoId, bodyUpdate, opts);
    return ArqueoTransform.transformToBusinessObject(arqueoUpdated);
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Realiza la baja lógica del arqueo con id igual al dado como parametro en la base de datos.
 * @param {ObjectId} arqueoId 
 * @param {JSON} bodyUpdate 
 */
async function logicalDelete(arqueoId) {
  try {
    //TODO: recuperar el id del usuario del token y reemplazarlo en el deletedBy
    let bodyUpdate = {
      deleted: true,
      deletedBy: "5d38ebfcf361ae0cabe45a8e"
    }
    let arqueoUpdated = await ArqueoDAO.updateArqueoById(arqueoId, bodyUpdate);

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
    let arqueo = await ArqueoDAO.getArqueoById(arqueoId);
    arqueo.remove();
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
    let arqueoSaved = await ArqueoDAO.save(arqueo);
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
  update,
  logicalDelete
}