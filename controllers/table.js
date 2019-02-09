'use strict'

const Table = require('../models/table')

function getTables (req, res) {
  Table.find({}).sort( 'number' ).exec((err, tables) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!tables) return res.status(404).send({ message: `No existen mesas registradas en la base de datos.`})

    res.status(200).send({ tables })
  })
}

function getTableBySection (req, res) {
  let sectionId = req.params.sectionId
  Table.find({ section: sectionId }).sort( 'number' ).exec((err, tables) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    
    res.status(200).send({ tables })
  })
}

function getTable (req, res) {
  let tableId = req.params.tableId

  Table.findById(tableId, (err, table) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!table) return res.status(404).send({ message: `La mesa ${tableId} no existe`})

    res.status(200).send({ table }) //Cuando la clave y el valor son iguales
  })
}

function getTableByNumber (req, res) {
  let tableNumber = req.params.tableNumber
  Table.findOne({ number: tableNumber }, (err, table) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})

    if (!table) return res.status(404).send({ message: `No se encontró la mesa número ${tableNumber}`})

    res.status(200).send({ table })  
  })
}

function saveTable (req, res) {
  console.log('POST /api/table')
  console.log(req.body)

  let table = new Table()
  table.number = req.body.number
  table.section = req.body.section
  table.col = req.body.col
  table.row = req.body.row
  table.sizex = req.body.sizex
  table.sizey = req.body.sizey
  table.status = req.body.status

  table.save((err, tableStored) => {
    if(err){
      if(err['code'] == 11000) 
        return res.status(500).send({ message: `Ya existe una mesa con ese nombre. Ingrese otro nombre.` })
      return res.status(500).send({ message: `Error al guardar en la base de datos: ${err}` })
    }

    res.status(200).send({ table: tableStored })
  })
}

function updateTable (req, res) {
  let tableId = req.params.tableId
  let bodyUpdate = req.body

  Table.findByIdAndUpdate(tableId, bodyUpdate, (err, tableUpdated) => {
    if(err){
      if(err['code'] == 11000) 
        return res.status(500).send({ message: `Ya existe una mesa con ese nombre. Ingrese otro nombre.` })
    }

    res.status(200).send({ table: tableUpdated })
  })
}

function deleteTable (req, res) {
  let tableId = req.params.tableId

  Table.findById(tableId, (err, table) => {
    if (err) return res.status(500).send({ message: `Error al querer borrar la mesa: ${err}`})

    table.remove(err => {
      if (err) return res.status(500).send({ message: `Error al querer borrar la mesa: ${err}`})
      res.status(200).send({message: `La mesa ha sido eliminada`})
    })
  })
}

function deleteTablesBySection (req, res) {
  let sectionId = req.params.sectionId;

  Table.deleteMany({ section: sectionId }, (err) => {
    if (err) return res.status(500).send({ message: `Error al querer borrar las mesas de la sala ${sectionId}: ${err}`})
    res.status(200).send({message: `Las mesas han sido borradas`})
  })
}

function deleteTableByNumber (req, res) {
  let tableNumber = req.params.tableNumber;

  Table.deleteOne({ number: tableNumber }, (err) => {
    if (err) return res.status(500).send({ message: `Error al querer borrar la mesa número ${tableNumber}: ${err}`})
    res.status(200).send({message: `La mesa número ${tableNumber} ha sido borrada`})
  })
}

module.exports = {
  getTable,
  getTables,
  getTableByNumber,
  getTableBySection,
  saveTable,
  updateTable,
  deleteTable,
  deleteTablesBySection,
  deleteTableByNumber
}