'use strict'

const TableService = require('../../services/table');
const TableDAO = require('../../dataAccess/table');
const Table = require('../../models/table');
const HttpStatus = require('http-status-codes');
const validationTableStatus = require('../../shared/enums/validationTableStatus')

async function validateDelete(req, res, next) {
  try {
    let tableId = req.params.tableId;
    let table = new Table();
    try {
      table = await TableDAO.getTableById(tableId);
    } catch (err) {
      throw new Error(`Error al buscar una mesa con id ${tableId} para eliminarla: ${err.message}`);
    }

    if (table !== null && table !== undefined) {
      let validationStatusReturned = await TableService.deleteValidation(table.number, true);

      switch (validationStatusReturned) {
        case validationTableStatus.OK:
          req.table = table;
          next();
          break;

        case validationTableStatus.FAIL_OPEN_ORDER:
          return res.status(HttpStatus.METHOD_NOT_ALLOWED).send({ message: `La mesa ${table.number} no puede ser eliminada por que tiene una venta en curso.` });          
          break;

        case validationTableStatus.HAS_CLOSE_ORDER:
          return res.status(HttpStatus.CONFLICT).send({
            message: `La mesa ${table.number} tiene ventas asociadas.\n\n\r¿Deseas eliminarla de 
            todas formas?\n\n\rTodas las ventas asociadas quedarán sin una mesa asignada.`
          });          
          break;

        default:
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            message: `Error al querer borrar la mesa número ${table.number}: ${err.message}`
          });          
          break;
      }
    } else {
      throw new Error(`No se encontró mesa con id ${table._id}: ${err.message}`);
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateDelete
}