'use strict'

const Table = require('../models/table');

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Recupera las mesas de la base de datos según la query dada.
 * @param {JSON} query 
 * @param {JSON} sortCondition condiciones para ordenar los resultados.
 * @returns mesas recuperadas de la base de datos que cumplen con la query dada.
 */
async function getTablesByQuery(query, sortCondition = { number: 1 }) {
  try {
    return await Table.find(query).sort(sortCondition);    
  }
  catch (err) {
    handleTableError(err);
  }
}

/**
 * @description Recupera una única mesa de la base de datos que cumpla con la query dada como parámetro. 
 * Si hay mas de una devuelve la primera que encuentra.
 * @param {JSON} query 
 * @returns primer mesa encontrada que cumple con la query dada.
 */
async function getOneTableByQuery(query) {
  try {
    return await Table.findOne(query);
  }
  catch (err) {
    handleTableError(err);
  }
}

/**
 * @description Recupera la mesa con id igual al dado como parámetro de la base de datos.
 * @param {string} tableId
 * @returns mesa recuperada de la base de datos.
 */
async function getTableById(tableId) {
  try {
    return await Table.findById(tableId);    
  }
  catch (err) {
    handleTableError(err);
  }
}

/**
 * @description Actualiza la mesa en la base de datos segun el id de mesa dado.
 * @param {String} tableId id de la mesa a actualizar en la base de datos.
 * @param {JSON} bodyUpdate propiedades de la mesa que se quieren actualizar.
 * @param {JSON} opts parámetros para realizar el update.
 * @returns mesa actualizada en la base de datos.
 */
async function updateTableById(tableId, bodyUpdate, opts = { new: true }) {
  try {
    if (tableId === null || tableId === undefined) {
      throw new Error('El id de la mesa que se quiere actualizar no puede ser nulo');
    }

    return await Table.findByIdAndUpdate(tableId, bodyUpdate, opts);    
  } catch (err) {
    handleTableError(err);
  }
}

/**
 * @description Actualiza la mesa en la base de datos segun el número de mesa dado.
 * @param {String} tableNumber número de la mesa a actualizar en la base de datos.
 * @param {JSON} bodyUpdate propiedades de la mesa que se quieren actualizar.
 * @param {JSON} opts parámetros para realizar el update.
 * @returns mesa actualizada en la base de datos.
 */
async function updateTableByNumber(tableNumber, bodyUpdate, opts = { new: true }) {
  try {
    if (tableNumber === null || tableNumber === undefined) {
      throw new Error('El número de la mesa que se quiere actualizar no puede ser nulo');
    }

    return await Table.findOneAndUpdate({ number: tableNumber }, bodyUpdate, opts);    
  } catch (err) {
    handleTableError(err);
  }
}

/**
 * @description Guarda la mesa dada como parámetro en la base de datos.
 * @param {Table} table
 */
async function save(table) {
  try {
    if (table === null || table === undefined) {
      throw new Error('La mesa que se quiere guardar en la base de datos no puede ser nula');
    }

    let tableSaved = await table.save();
    return tableSaved;
  } catch (err) {
    handleTableError(err);
  }
}

/**
 * @description Elmina la mesa dada como parámetro en la base de datos.
 * @param {Table} table
 * @param {JSON} opts
 */
async function remove(table, opts = {}) {
  try {
    if (table === null || table === undefined) {
      throw new Error('Le mesa que se quiere eliminar de la base de datos no puede ser nula');
    }

    await table.remove(opts);
  } catch (err) {
    handleTableError(err);
  }
}

function handleTableError(err) {
  if (err.code === 11000) {
    if (err.keyPattern.number !== null && err.keyPattern.number !== undefined) {
      throw new Error(`Ya existe una mesa con ese NÚMERO. Ingrese uno distinto por favor.`);
    } else {
      throw new Error(err.message);
    }
  } else {
    throw new Error(err.message);
  }
}

module.exports = {
  getOneTableByQuery,
  getTablesByQuery,
  getTableById,
  updateTableById,
  updateTableByNumber,
  save,
  remove
}