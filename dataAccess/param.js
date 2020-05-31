'use strict'

const Param = require('../models/param');

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Recupera el/los parámetro/s segun la query dada y ordenados por la condicion dada
 * @param {JSON} query query para realizar la busqueda
 * @param {JSON} sortCondition condiciones para ordenar los resultados
 */
async function getParamsSortedByQuery(query, sortCondition = {}) {
  try {
    return await Param.find(query).sort(sortCondition);
  }
  catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  getParamsSortedByQuery
}