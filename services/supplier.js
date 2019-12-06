'use strict'

const SupplierDAO = require('../dataAccess/supplier');

/**
 * @description Recupera todos los proveedores de la base de datos.
 * @returns proveedores recuperados de la base de datos.
 */
async function getAll() {
  try {
    let suppliers = await SupplierDAO.getSuppliersByQuery({});
    return suppliers;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Devuelve el proveedor con id igual al dado como parámetro.
 * @param {string} supplierId id del proveedor que se quiere recuperar de la base de datos.
 */
async function getSupplier(supplierId) {
  try {
    if (supplierId === null || supplierId === undefined) {
      throw new Error('Se debe especificar el id del proveedor que se quiere obtener de la base de datos');
    }

    let supplier = await SupplierDAO.getSupplierById(supplierId);
    return supplier
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Actualiza las propiedades dadas como parámetro del proveedor con id igual al dado como parámetro.
 * @param {String} supplierId id del proveedor a actualizar.
 * @param {JSON} bodyUpdate datos a actualizar en la base de datos.
 * @returns proveedor actualizado en la base de datos.
 */
async function update(supplierId, bodyUpdate) {
  try {
    let supplier = await SupplierDAO.updateSupplierById(supplierId, bodyUpdate);
    return supplier;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Guarda el proveedor dado como parámetro en la base de datos.
 * @param {Supplier} supplier proveedor que se quiere guardar en la base de datos.
 * @returns proveedor guardado en la base de datos.
 */
async function saveSupplier(supplier) {
  let supplierSaved = await SupplierDAO.save(supplier);
  return supplierSaved;
}

/**
 * @description Elimina el proveedor con id igual al dado como parámetro de la base de datos.
 * @param {String} supplierId id del proveedor que se quiere eliminar.
 */
async function deleteSupplier(supplierId) {
  try {
    let supplier = await SupplierDAO.getSupplierById(supplierId);
    await SupplierDAO.remove(supplier);
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  getAll,
  getSupplier,
  update,
  saveSupplier,
  deleteSupplier
}