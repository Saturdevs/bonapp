'use strict'

const Supplier = require('../models/supplier');

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Recupera los proveedores de la base de datos según la query dada.
 * @param {JSON} query 
 * @param {JSON} sortCondition condiciones para ordenar los resultados.
 * @returns proveedores recuperados de la base de datos que cumplen con la query dada.
 */
async function getSuppliersByQuery(query, sortCondition = { name: 1 }) {
  try {
    return await Supplier.find(query).sort(sortCondition);    
  }
  catch (err) {
    handleSupplierError(err);
  }
}

/**
 * @description Recupera el proveedor con id igual al dado como parámetro de la base de datos.
 * @param {string} supplierId
 * @returns proveedor recuperado de la base de datos.
 */
async function getSupplierById(supplierId) {
  try {
    let supplier = await Supplier.findById(supplierId);
    return supplier;
  }
  catch (err) {
    handleSupplierError(err);
  }
}

/**
 * @description Actualiza el proveedor en la base de datos segun el id dado.
 * @param {String} supplierId id del proveedor a actualizar en la base de datos.
 * @param {JSON} bodyUpdate propiedades del size que se quieren actualizar.
 * @param {JSON} opts parámetros para realizar el update.
 * @returns proveedor actualizado en la base de datos.
 */
async function updateSupplierById(supplierId, bodyUpdate, opts = { new: true }) {
  try {
    if (supplierId === null || supplierId === undefined) {
      throw new Error('El id del proveedor que se quiere actualizar no puede ser nulo');
    }

    let supplierUpdated = await Supplier.findByIdAndUpdate(supplierId, bodyUpdate, opts);
    return supplierUpdated;
  } catch (err) {
    handleSupplierError(err);
  }
}

/**
 * @description Guarda el proveedor dado como parámetro en la base de datos.
 * @param {Supplier} supplier
 */
async function save(supplier) {
  try {
    if (supplier === null || supplier === undefined) {
      throw new Error('El proveedor que se quiere guardar en la base de datos no puede ser nulo');
    }

    let supplierSaved = await supplier.save();
    return supplierSaved;
  } catch (err) {
    handleSupplierError(err);
  }
}

/**
 * @description Elmina el proveedor dado como parámetro en la base de datos.
 * @param {Supplier} supplier
 */
async function remove(supplier) {
  try {
    if (supplier === null || supplier === undefined) {
      throw new Error('El proveedor que se quiere eliminar de la base de datos no puede ser nulo');
    }

    await supplier.remove();
  } catch (err) {
    handleSupplierError(err);
  }
}

function handleSupplierError(err) {
  if (err.code === 11000) {
    if (err.keyPattern.email !== null && err.keyPattern.email !== undefined) {
      throw new Error(`Ya existe un proveedor con ese EMAIL. Ingrese uno distinto por favor.`);
    } else {
      throw new Error(err.message);
    }
  } else {
    throw new Error(err.message);
  }
}

module.exports = {
  getSuppliersByQuery,
  getSupplierById,
  updateSupplierById,
  save,
  remove
}