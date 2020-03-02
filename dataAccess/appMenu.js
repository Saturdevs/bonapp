'use strict'

const AppMenu = require('../models/appMenu');

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Recupera el/los menu/s de la app de la base de datos segun la query dada y ordenados por la condicion dada
 * @param {JSON} query query para realizar la busqueda
 * @param {JSON} sortCondition condiciones para ordenar los resultados
 */
async function getAppMenusSortedByQuery(query, sortCondition = {}) {
  try {
    return await AppMenu.find(query).sort(sortCondition);
  }
  catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  getAppMenusSortedByQuery
}