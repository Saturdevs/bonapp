'use strict'

const Param = require('../models/param');
const ParamDAO = require('../dataAccess/param');

/**
 * @description Devuelve todos los parámetros de la app almacenados en la base de datos
 * ordenados por id.
 * @returns params recuperados de la bd.
 */
async function getAllParams() {
  try {
    return await ParamDAO.getParamsSortedByQuery({}, { _id: 1 });
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  getAllParams
}