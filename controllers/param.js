'use strict'

const ParamService = require('../services/param');
const HttpStatus = require('http-status-codes');

async function getAllParams(req, res) {
  try {
    let params = await ParamService.getAllParams();

    if (params !== null && params !== undefined) {
      res.status(HttpStatus.OK).send({ params });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen parámetros registrados en la base de datos.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

module.exports = {
  getAllParams
}