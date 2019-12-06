'use strict'

const Size = require('../models/size');

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Recupera los tamaños de la base de datos según la query dada.
 * @param {JSON} query 
 * @param {JSON} sortCondition condiciones para ordenar los resultados.
 * @returns tamaños recuperados de la base de datos que cumplen con la query dada.
 */
async function getSizesByQuery(query, sortCondition = { name: 1 }) {
  try {
    return await Size.find(query).sort(sortCondition);    
  }
  catch (err) {
    handleSizeError(err);
  }
}

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
    handleSizeError(err);
  }
}

/**
 * @description Actualiza el tamaño en la base de datos segun el id dado.
 * @param {String} sizeId id del tamaño a actualizar en la base de datos.
 * @param {JSON} bodyUpdate propiedades del size que se quieren actualizar.
 * @param {JSON} opts parámetros para realizar el update.
 * @returns tamaño actualizado en la base de datos.
 */
async function updateSizeById(sizeId, bodyUpdate, opts = { new: true }) {
  try {
    if (sizeId === null || sizeId === undefined) {
      throw new Error('El id del tamaño que se quiere actualizar no puede ser nulo');
    }

    let sizeUpdated = await Size.findByIdAndUpdate(sizeId, bodyUpdate, opts);
    return sizeUpdated;
  } catch (err) {
    handleSizeError(err);
  }
}

/**
 * @description Guarda el tamaño dado como parámetro en la base de datos.
 * @param {Size} size
 */
async function save(size) {
  try {
    if (size === null || size === undefined) {
      throw new Error('El tamaño que se quiere guardar en la base de datos no puede ser nulo');
    }

    let sizeSaved = await size.save();
    return sizeSaved;
  } catch (err) {
    handleSizeError(err);
  }
}

/**
 * @description Elmina el tamaño dado como parámetro en la base de datos.
 * @param {Size} size
 */
async function remove(size) {
  try {
    if (size === null || size === undefined) {
      throw new Error('El tamaño que se quiere eliminar de la base de datos no puede ser nulo');
    }

    await size.remove();
  } catch (err) {
    handleSizeError(err);
  }
}

function handleSizeError(err) {
  if (err.code === 11000) {
    if (err.keyPattern.name !== null && err.keyPattern.name !== undefined) {
      throw new Error(`Ya existe un tamaño con ese NOMBRE. Ingrese uno distinto por favor.`);
    } else {
      throw new Error(err.message);
    }
  } else {
    throw new Error(err.message);
  }
}

module.exports = {
  getSizesByQuery,
  getSizeById,
  updateSizeById,
  save,
  remove
}