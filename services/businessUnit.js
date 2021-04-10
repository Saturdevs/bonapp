'use strict'

const BusinessUnitDAO = require('../dataAccess/businessUnit');

/**
 * @description Devuelve las business units que tengan el código igual a alguno de los
 * dados como parametro.
 * @param {Array<String>} codes códigos de las business units que se quieren buscar en la base de datos
 * @returns business units que tengan un código igual a alguno de los dados como parametro
 */
async function getBusinessUnitsByCode(codes) { 
  try {
    let query = {
      code: { $in: codes }
    };
    let sortCondition = { name: 1 };
    return await BusinessUnitDAO.getBusinessUnitsSortedByQuery(query, sortCondition);
  } catch (err) {
    throw new Error(err);    
  }
}

module.exports = {
  getBusinessUnitsByCode
}