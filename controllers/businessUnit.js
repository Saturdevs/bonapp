'use strict'

/**
 * @module BusinessUnit
 */

const BusinessUnitService = require('../services/businessUnit');
const HttpStatus = require('http-status-codes');

/** 
 * @method
 * @description Devuelve todos las business units con coódigo igual a algunos de 
 * los dados como parametro.
 * @return {json} businessUnits
 */
async function getBusinessUnitsByCode(req, res) {
  try {
    const codes = req.query.codes;
    let businessUnits = await BusinessUnitService.getBusinessUnitsByCode(codes);

    if (businessUnits !== null && businessUnits !== undefined) {
      res.status(HttpStatus.OK).send({ businessUnits });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen business units con alguno de los códigos dado como parametros.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

module.exports = {
  getBusinessUnitsByCode
}