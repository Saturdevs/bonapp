'use strict'

const Supplier = require('../models/supplier')

function getSuppliers (req, res) {
  Supplier.find({}, null, {sort: {name: 1}}, (err, suppliers) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!suppliers) return res.status(404).send({ message: `No existen proveedores registrados en la base de datos.`})

    res.status(200).send({ suppliers })
  })
}

function getSupplier (req, res) {
  let supplierId = req.params.supplierId

  Supplier.findById(supplierId, (err, supplier) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!supplier) return res.status(404).send({ message: `El proveedor ${supplierId} no existe`})

    res.status(200).send({ supplier })
  })
}

function saveSupplier (req, res) {
  console.log('POST /api/supplier')
  console.log(req.body)

  let supplier = new Supplier()
  supplier.name = req.body.name
  supplier.tel = req.body.tel || null
  supplier.email = req.body.email || null
  supplier.addressStreet = req.body.addressStreet || null
  supplier.addressNumber = req.body.addressNumber || null
  supplier.addressDpto = req.body.addressDpto || null
  supplier.active = req.body.active

  supplier.save((err, supplierStored) => {
    if(err){
      return res.status(500).send({ message: `Error al guardar en la base de datos: ${err}` });
    }

    res.status(200).send({ supplier: supplierStored })
  })
}

function updateSupplier (req, res) {
  let supplierId = req.params.supplierId
  let bodyUpdate = req.body

  Supplier.findByIdAndUpdate(supplierId, bodyUpdate, (err, supplierUpdated) => {
    if(err){
      return res.status(500).send({ message: `Error al guardar en la base de datos: ${err}` });
    }

    res.status(200).send({ supplier: supplierUpdated })
  })
}

function deleteSupplier (req, res) {
  let supplierId = req.params.supplierId

  Supplier.findById(supplierId, (err, supplier) => {
    if (err) return res.status(500).send({ message: `Error al querer borrar el proveedor: ${err}`})

    supplier.remove(err => {
      if (err) return res.status(500).send({ message: `Error al querer borrar el proveedor: ${err}`})
      res.status(200).send({message: `El proveedor ha sido eliminado`})
    })
  })
}

module.exports = {
  getSupplier,  
  getSuppliers,
  saveSupplier,
  updateSupplier,
  deleteSupplier
}