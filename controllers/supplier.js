'use strict'

const Supplier = require('../models/supplier');
const SupplierService = require('../services/supplier');
const HttpStatus = require('http-status-codes');

async function getSuppliers(req, res) {
  try {
    let suppliers = await SupplierService.getAll();

    if (suppliers !== null && suppliers !== undefined) {
      res.status(HttpStatus.OK).send({ suppliers });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen proveedores almacenadas en la base de datos.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getSupplier(req, res) {
  try {
    let supplierId = req.params.supplierId;
    let supplier = await SupplierService.getSupplier(supplierId);

    if (supplier !== null && supplier !== undefined) {
      res.status(HttpStatus.OK).send({ supplier });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `El proveedor con id ${supplierId} no existe en la base da datos` });
    }
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function saveSupplier(req, res) {
  try {
    let supplier = new Supplier();
    supplier.name = req.body.name;
    supplier.tel = req.body.tel || null;
    supplier.email = req.body.email || null;
    supplier.addressStreet = req.body.addressStreet || null;
    supplier.addressNumber = req.body.addressNumber || null;
    supplier.addressDpto = req.body.addressDpto || null;
    supplier.active = req.body.active;

    let supplierSaved = await SupplierService.saveSupplier(supplier);

    res.status(HttpStatus.OK).send({ supplier: supplierSaved });
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

async function updateSupplier(req, res) {
  try {
    let supplierId = req.params.supplierId;
    let bodyUpdate = req.body

    let supplierUpdated = await SupplierService.update(supplierId, bodyUpdate);
    res.status(HttpStatus.OK).send({ supplier: supplierUpdated });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer actualizar el proveedor: ${err.message}.` });
  }
}

function deleteSupplier(req, res) {
  try {
    let supplierId = req.params.supplierId;
    SupplierService.deleteSupplier(supplierId);
    res.status(HttpStatus.OK).send({ message: `El proveedor ha sido eliminado de la base de datos correctamente.` });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer borrar el proveedor de la base de datos: ${err.message}` })
  }
}

module.exports = {
  getSupplier,
  getSuppliers,
  saveSupplier,
  updateSupplier,
  deleteSupplier
}