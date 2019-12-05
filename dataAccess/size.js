'use strict'

const Size = require('../models/size');

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Recupera el tamaño con id igual al dado como parámetro de la base de datos.
 * @param {string} sizeId
 * @returns tamaño recuperado de la base de datos.
 */
async function getSizeById(sizeId) {
  try {
    let size = await Size.findById(sizeId);
    return size;
  }
  catch (err) {
    throw new Error(err);
  }
}


module.exports = {
  getSizeById
}