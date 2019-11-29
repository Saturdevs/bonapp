'use strict'

const Arqueo = require('../models/arqueoCaja');

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Recupera de la base de datos el arqueo con id igual al dado como parametro
 * @param {*} arqueoId id del arqueo que se quiere recuperar de la base de datos
 */
async function getArqueoById(arqueoId) {
  try {
    if (arqueoId === null || arqueoId === undefined) {
      throw new Error('El id del arqueo que se quiere buscar en la base de datos no puede ser nulo');
    }

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
    if (arqueoId === null || arqueoId === undefined) {
      throw new Error('El id del arqueo a actualizar no puede ser nulo');
    }

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
    if (arqueo === null || arqueo === undefined) {
      throw new Error('El arqueo no puede ser nulo');
    }
    
    let arqueoSaved = await arqueo.save(arqueo);
    return arqueoSaved;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  getArqueoById,
  getArqueoByQuery,
  getArqueoSortByQuery,
  getOneCashCountByQuery,
  updateArqueoById,
  save
}