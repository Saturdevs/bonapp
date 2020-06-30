'use strict'

const mongoose = require('mongoose');
const TableDAO = require('../dataAccess/table');
const OrderDAO = require('../dataAccess/order');
const validationTableStatus = require('../shared/enums/validationTableStatus')

/**
 * @description Recupera todas las mesas de la base de datos.
 * @returns mesas recuperadas de la base de datos.
 */
async function getAll() {
  try {
    return await TableDAO.getTablesByQuery({});
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Recupera todas las mesas para la sección dada.
 * @param sectionId id de la sala para la que se quiere recuperar las mesas.
 * @returns mesas recuperadas de la base de datos.
 */
async function getTablesBySection(sectionId) {
  try {
    return await TableDAO.getTablesByQuery({ section: sectionId });
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Devuelve la mesa con id igual al dado como parámetro.
 * @param {string} tableId id de la mesa que se quiere recuperar de la base de datos.
 */
async function getTable(tableId) {
  try {
    if (tableId === null || tableId === undefined) {
      throw new Error('Se debe especificar el id de la mesa que se quiere obtener de la base de datos');
    }

    return await TableDAO.getTableById(tableId);
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Devuelve la mesa con número igual al dado como parámetro.
 * @param {string} tableNumber número de la mesa que se quiere recuperar de la base de datos.
 */
async function getTableByNumber(tableNumber) {
  try {
    if (tableNumber === null || tableNumber === undefined) {
      throw new Error('Se debe especificar el número de la mesa que se quiere obtener de la base de datos');
    }

    return await TableDAO.getOneTableByQuery({ number: tableNumber });
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Actualiza las propiedades dadas como parámetro de la mesa con id igual al dado como parámetro.
 * @param {String} tableId id de la mesa a actualizar.
 * @param {JSON} bodyUpdate datos a actualizar en la base de datos.
 * @returns mesa actualizada.
 */
async function update(tableId, bodyUpdate) {
  try {
    return await TableDAO.updateTableById(tableId, bodyUpdate);
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Actualiza las propiedades dadas como parámetro de la mesa con número igual al dado como parámetro.
 * @param {String} tableNumber número de la mesa a actualizar.
 * @param {JSON} bodyUpdate datos a actualizar en la base de datos.
 * @returns mesa actualizada.
 */
async function updateTableByNumber(tableNumber, bodyUpdate, opts) {
  try {
    return await TableDAO.updateTableByNumber(tableNumber, bodyUpdate, opts);
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Guarda la mesa dada como parámetro en la base de datos.
 * @param {Table} table mesa que se quiere guardar en la base de datos.
 * @returns mesa guardada en la base de datos.
 */
async function saveTable(table) {
  try {
    return await TableDAO.save(table);
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Elimina la mesa dada como parámetro de la base de datos.
 * @param {Table} table mesa a eliminar de la base de datos.
 */
async function deleteTable(table) {
  try {
    await TableDAO.remove(table);
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Elimina la mesa dada como parámetro de la base de datos y todos los pedidos para esa mesa los setea
 * con table igual a null.
 * @param {Table} tableNumber número de la mesa a eliminar de la base de datos.
 */
async function unSetAndDeleteTable(tableNumber) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const opts = { session: session, new: true };

    await OrderDAO.updateMany({ table: tableNumber }, { table: null }, opts);

    let table = await getTableByNumber(tableNumber);
    await TableDAO.remove(table, opts);

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

async function deleteValidation(tableNumber, checkForClosedOrders) {
  let statusResult = validationTableStatus.OK;
  try {
    let openOrder = await OrderDAO.getOneOrderByQuery({ table: tableNumber, status: 'Open' });

    if (openOrder !== null && openOrder !== undefined) {
      statusResult = validationTableStatus.FAIL_OPEN_ORDER;
    }
  } catch (err) {
    throw new Error(`Error al querer recuperar un pedido abierto para la mesa ${tableNumber}: ${err.message}`);
  }

  if (statusResult === validationTableStatus.OK && checkForClosedOrders) {
    try {
      let closedOrder = await OrderDAO.getOneOrderByQuery({ table: tableNumber, status: 'Closed' });

      if (closedOrder !== null && closedOrder !== undefined) {
        statusResult = validationTableStatus.HAS_CLOSE_ORDER
      }
    } catch (err) {
      throw new Error(`Error al querer recuperar un pedido cerrado para la mesa ${tableNumber}: ${err.message}`);
    }
  }

  return statusResult;
}

module.exports = {
  getAll,
  getTablesBySection,
  getTable,
  getTableByNumber,
  update,
  updateTableByNumber,
  saveTable,
  deleteTable,
  unSetAndDeleteTable,
  deleteValidation
}