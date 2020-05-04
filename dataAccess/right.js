'use strict'

const Right = require('../models/right');

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Recupera el/los permisos de la base de datos segun la query dada y ordenados por la condicion dada.
 * @param {JSON} query query para realizar la busqueda
 * @param {JSON} sortCondition condiciones para ordenar los resultados
 */
async function getRightsSortedByQuery(query, sortCondition = {}) {
  try {
    const rights = await Right.find(query).sort(sortCondition); 
    return rights;
  }
  catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  getRightsSortedByQuery
}