'use strict'

const validationStatus = require('../shared/enums/validationTableStatus')
const TableService = require('../services/table');
const HttpStatus = require('http-status-codes')
const Table = require('../models/table')
const Order = require('../models/order')

async function getTables(req, res) {
  try {
    let tables = await TableService.getAll();

    if (tables !== null && tables !== undefined) {
      res.status(HttpStatus.OK).send({ tables });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen mesas almacenadas en la base de datos.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getTablesBySection(req, res) {
  try {
    let sectionId = req.params.sectionId;
    let tables = await TableService.getTablesBySection(sectionId);

    if (tables !== null && tables !== undefined) {
      res.status(HttpStatus.OK).send({ tables });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen mesas almacenadas para la sección seleccionada en la base de datos.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getTable(req, res) {
  try {
    let tableId = req.params.tableId;
    let table = await TableService.getTable(tableId);

    if (table !== null && table !== undefined) {
      res.status(HttpStatus.OK).send({ table });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `La mesa con id ${tableId} no existe en la base da datos` });
    }
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getTableByNumber(req, res) {
  try {
    let tableNumber = req.params.tableNumber;
    let table = await TableService.getTableByNumber(tableNumber);

    if (table !== null && table !== undefined) {
      res.status(HttpStatus.OK).send({ table });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No se encontró la mesa número ${tableNumber} en la base da datos` });
    }
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function saveTable(req, res) {
  try {
    let table = new Table();
    table.number = req.body.number;
    table.section = req.body.section;
    table.col = req.body.col;
    table.row = req.body.row;
    table.sizex = req.body.sizex;
    table.sizey = req.body.sizey;
    table.status = req.body.status;

    let tableSaved = await TableService.saveTable(table);

    res.status(HttpStatus.OK).send({ table: tableSaved });
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al guardar en la base de datos: ${err.message}` });
  }
}

async function updateTable(req, res) {
  try {
    let tableId = req.params.tableId;
    let bodyUpdate = req.body;

    let tableUpdated = await TableService.update(tableId, bodyUpdate);
    res.status(HttpStatus.OK).send({ table: tableUpdated });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer actualizar la mesa: ${err.message}.` });
  }
}

async function updateTableByNumber(req, res) {
  try {
    let tableNumber = req.params.tableNumber;
    let bodyUpdate = req.body;

    let tableUpdated = await TableService.updateTableByNumber(tableNumber, bodyUpdate);
    res.status(HttpStatus.OK).send({ table: tableUpdated });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer actualizar la mesa: ${err.message}.` });
  }
}

async function unSetAndDeleteTable(req, res) {
  try {
    let tableNumber = req.params.tableNumber;
    await TableService.unSetAndDeleteTable(tableNumber);
    res.status(HttpStatus.OK).send({ message: `Todos los pedidos con número de mesa ${tableNumber} han quedado sin una mesa asignada` });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al eliminar mesa número ${tableNumber} del pedido: ${err}` });
  }
}

async function deleteTableById(req, res) {
  try {
    //Le mesa se setea en el middleware validatorDelete
    let table = req.table;
    await TableService.deleteTable(table);
    res.status(HttpStatus.OK).send({ message: `La mesa número ${table.number} ha sido eliminada de la base de datos correctamente.` });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer borrar la mesa número ${table.number}: ${err.message}` });
  }
}

module.exports = {
  getTable,
  getTables,
  getTableByNumber,
  getTablesBySection,
  saveTable,
  updateTable,
  updateTableByNumber,
  unSetAndDeleteTable,
  deleteTableById
}