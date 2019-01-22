'use strict'

const Size = require('../models/size')

function getSizes (req, res) {
  Size.find({}, null, {sort: {name: 1}}, (err, sizes) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!sizes) return res.status(404).send({ message: `No existen tamaños registrados en la base de datos.`})

    res.status(200).send({ sizes })
  })
}

function getSize (req, res) {
  let sizeId = req.params.sizeId

  Size.findById(sizeId, (err, size) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!size) return res.status(404).send({ message: `El tamaño ${sizeId} no existe`})

    res.status(200).send({ size }) //Cuando la clave y el valor son iguales
  })
}

function saveSize (req, res) {
  console.log('POST /api/Size')
  console.log(req.body)

  let size = new Size()
  size.name = req.body.name
  size.available = req.body.available  

  size.save((err, sizeStored) => {
    if(err){
      if(err['code'] == 11000) 
        return res.status(500).send({ message: `Ya existe un tamaño con ese nombre. Ingrese otro nombre.` })
    }

    res.status(200).send({ size: sizeStored })
  })
}

function updateSize (req, res) {
  let sizeId = req.params.sizeId
  let bodyUpdate = req.body

  Size.findByIdAndUpdate(sizeId, bodyUpdate, (err, sizeUpdated) => {
    if(err){
      if(err['code'] == 11000) 
        return res.status(500).send({ message: `Ya existe un tamaño con ese nombre. Ingrese otro nombre.` })
    }

    res.status(200).send({ size: sizeUpdated })
  })
}

function deleteSize (req, res) {
  let sizeId = req.params.sizeId

  Size.findById(sizeId, (err, size) => {
    if (err) return res.status(500).send({ message: `Error al querer borrar el tamaño: ${err}`})

    size.remove(err => {
      if (err) return res.status(500).send({ message: `Error al querer borrar el tamaño: ${err}`})
      res.status(200).send({message: `El tamaño ha sido eliminado`})
    })
  })
}

module.exports = {
  getSizes,  
  getSize,
  saveSize,
  updateSize,
  deleteSize
}