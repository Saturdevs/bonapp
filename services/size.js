'use strict'

const SizeDAO = require('../dataAccess/size');
const SizeTransform = require('../transformers/size');

/**
 * @description Recupera todos los productos de la base de datos.
 * @returns productos recuperados de la base de datos.
 */
async function getAll() {
  try {
    let sizesToReturn = [];
    let sizes = await SizeDAO.getSizesByQuery({});

    for (let i = 0; i < sizes.length; i++) {
      const sizeTransformed = await SizeTransform.transformToBusinessObject(sizes[i]);
      sizesToReturn.push(sizeTransformed);
    }

    return sizesToReturn;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Devuelve el tamaño con id igual al dado como parámetro.
 * @param {string} sizeId id del tamaño que se quiere recuperar de la base de datos.
 */
async function getSize(sizeId) {
  try {
    let size = null;
    if (sizeId === null || sizeId === undefined) {
      throw new Error('Se debe especificar el id del tamaño que se quiere obtener de la base de datos');
    }

    size = await SizeDAO.getSizeById(sizeId);

    if (size !== null && size !== undefined) {
      size = SizeTransform.transformToBusinessObject(size);
    }

    return size;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Actualiza las propiedades dadas como parámetro del tamaño con id igual al dado como parámetro.
 * @param {String} sizeId id del tamaño a actualizar.
 * @param {JSON} bodyUpdate datos a actualizar en la base de datos.
 * @returns tamaño actualizado y convertido al modelo usado en el frontend.
 */
async function update(sizeId, bodyUpdate) {
  try {
    let sizeUpdated = await SizeDAO.updateSizeById(sizeId, bodyUpdate);

    if (sizeUpdated !== null && sizeUpdated !== undefined) {
      sizeUpdated = SizeTransform.transformToBusinessObject(sizeUpdated);
    }

    return sizeUpdated;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Guarda el tamaño dado como parámetro en la base de datos.
 * @param {Size} size tamaño que se quiere guardar en la base de datos.
 * @returns tamaño guardado en la base de datos y transformado al modelo usado en el frontend.
 */
async function saveSize(size) {
  let sizeSaved = await SizeDAO.save(size);

  return SizeTransform.transformToBusinessObject(sizeSaved);
}

/**
 * @description Elimina el tamaño con id igual al dado como parámetro de la base de datos.
 * @param {String} sizeId id del tamaño que se quiere eliminar.
 */
async function deleteSize(sizeId) {
  try {
    let size = await SizeDAO.getSizeById(sizeId);
    await SizeDAO.remove(size);
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  getAll,
  getSize,
  update,
  saveSize,
  deleteSize
}