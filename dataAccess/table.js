'use strict'

const Table = require('../models/table');

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

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
    handleProductError(err);
  }
}

function handleProductError(err) {
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
  getOneTableByQuery
}