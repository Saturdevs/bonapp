'use strict'

const validationStatus = require('../shared/enums/validationStatus')
const HttpStatus = require('http-status-codes')
const Table = require('../models/table')
const Order = require('../models/order')

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

function updateTableByNumber (req, res) {
  let tableNumber = req.params.tableNumber
  let bodyUpdate = req.body

  Table.findOneAndUpdate({number: tableNumber}, bodyUpdate, {new: true}, (err, tableUpdated) => {
    if(err){
      if(err['code'] == 11000) 
        return res.status(500).send({ message: `Ya existe una mesa con ese nombre. Ingrese otro nombre.` })
    }

    res.status(200).send({ table: tableUpdated })
  })
}

function deleteTableById (req, res) {
  let tableId = req.params.tableId

  Table.findById(tableId, async (err, table) => {
    if (err) return res.status(500).send({ message: `Error al buscar una mesa con id ${tableId} para eliminarla: ${err}`})

    if (table !== null && table !== 'undefined') {
      let result = await deleteTable(table.number);

      if (result.status === HttpStatus.OK) {
        res.status(HttpStatus.OK).send({message: result.message})
      } else if (result.status !== HttpStatus.OK ) {
        res.status(result.status).send({message: result.message})
      }
    }    
  })
}

function deleteTablesBySection (req, res) {
  let sectionId = req.params.sectionId;

  Table.deleteMany({ section: sectionId }, (err) => {
    if (err) return res.status(500).send({ message: `Error al querer borrar las mesas de la sala ${sectionId}: ${err}`})
    res.status(200).send({message: `Las mesas han sido borradas`})
  })
}

async function deleteTableByNumber (req, res) {
  let tableNumber = req.params.tableNumber;

  let result = await deleteTable(tableNumber);
  
  if (result.status === HttpStatus.OK) {
    res.status(HttpStatus.OK).send({message: result.message})
  } else if (result.status !== HttpStatus.OK ) {
    res.status(result.status).send({message: result.message})
  }
}

async function deleteTable (tableNumber) {
  let result = {};
  let validationStatusReturned = await validateDelete(tableNumber)

  switch (validationStatusReturned) {
    case validationStatus.OK:
      await Table.deleteOne({ number: tableNumber }, (err) => {
        if (err) {
          result = {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: `Error al querer borrar la mesa número ${tableNumber}: ${err}`
          }
        } else {
          result = {
            status: HttpStatus.OK,
            message: `La mesa número ${tableNumber} ha sido borrada`
          } 
        }
      })
      break;
  
    case validationStatus.FAIL_OPEN_ORDER:
      result = {
        status: HttpStatus.METHOD_NOT_ALLOWED,
        message: `La mesa ${tableNumber} no puede ser eliminada por que tiene una venta en curso.`
      }
      break;

    case validationStatus.HAS_CLOSE_ORDER:
      result = {
        status: HttpStatus.CONFLICT,
        message: `La mesa ${tableNumber} tiene ventas asociadas.\n\n\r¿Deseas eliminarla de 
        todas formas?\n\n\rTodas las ventas asociadas quedarán sin una mesa asignada.`
      }
      break;

    default:
      result = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error al querer borrar la mesa número ${tableNumber}: ${err}`
      }
      break;  
  }

  return result
}

async function validateDelete(tableNumber) {  
  let statusResult = validationStatus.OK;
  await Order.findOne({ table: tableNumber, status: 'Open' }, (err, orderOpen) => {    
    if (err) return res.status(500).send({ message: `Error al querer recuperar un pedido abierto para la mesa ${tableNumber}: ${err}`})

    if (orderOpen !== null && orderOpen !== 'undefined') {          
      statusResult = validationStatus.FAIL_OPEN_ORDER;
    }
  })  

  if (statusResult === validationStatus.OK)
  {
    await Order.findOne({ table: tableNumber, status: 'Closed' }, (err, orderClosed) => {
      if (orderClosed !== null && orderClosed !== 'undefined') {
        statusResult = validationStatus.HAS_CLOSE_ORDER
      }
    })
  }
  
  return statusResult;
}

module.exports = {
  getTable,
  getTables,
  getTableByNumber,
  getTableBySection,
  saveTable,
  updateTable,
  updateTableByNumber,
  deleteTableById,
  deleteTablesBySection,
  deleteTableByNumber
}