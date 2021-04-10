'use strict'

const BusinessUnit = require('../models/businessUnit');

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Recupera de la base de datos las business units que correspondan
 * según la query dada como parametro
 * @param {JSON} query query para recuperar business units de la basa de datos
 * @param {JSON} sortCondition consición por la que deben ser ordenados los resultados.
 */
async function getBusinessUnitsSortedByQuery(query = {}, sortCondition = {}) {
  try {
    if (query === null || query === undefined) {
      throw new Error('La query para buscar business units no debe ser null o undefined');
    }

    let businessUnits = await BusinessUnit.find(query).sort(sortCondition);
    return businessUnits;
  }
  catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  getBusinessUnitsSortedByQuery
}