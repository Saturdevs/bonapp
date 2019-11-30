'use strict'

const Transaction = require('../models/transaction');

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Recupera de la base de datos la transacción con id igual al dado como parametro
 * @param {*} transactionId id de la transacción que se quiere recuperar de la base de datos
 */
async function getTransactionById(transactionId) {
  try {
    if (transactionId === null || transactionId === undefined) {
      throw new Error('El id de la transacción no puede ser nulo');
    }
    let transaction = await Transaction.findById(transactionId);
    return transaction;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Recupera las transacciones de la base de datos según la query dada.
 * @param {JSON} query query para realizar la busqueda.
 * @param {JSON} sortCondition condiciones para ordenar los resultados.
 */
async function getTransactionsSortedByQuery(query, sortCondition) {
  try {
    let transactions = await Transaction.find(query).sort(sortCondition);
    return transactions;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Recupera el número especificado de transacciones de la base de datos según la query dada.
 * @param {JSON} query query para realizar la busqueda.
 * @param {JSON} sortCondition condiciones para ordenar los resultados.
 * @param {number} qty cantidad de transacciones a recuperar.
 */
async function getTransactionsLimitByQuery(query, sortCondition, qty) {
  try {
    let transactions = await Transaction.find(query).sort(sortCondition).limit(qty);
    return transactions;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Encuentra los distintos valores para el campo dado como parámetro.
 * @param {string} field campo para el que se quieren buscar los distintos valores.
 * @param {JSON} query query que especifica en que documentos buscar los valores del campo.
 * @returns los distintos valores del campo dado como parámetro.
 */
async function getDistinctOnTransactions(field, query) {
  try {
    let data = await Transaction.distinct(field, query);
    return data;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Recupera una única transacción que cumpla con la query dada como parámetro. Si hay mas de una devuelve 
 * la primera encuentra.
 * @param {JSON} query 
 */
async function getOneTransactionByQuery(query) {
  try {
    let transaction = await Transaction.findOne(query);
    return transaction;
  }
  catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Guarda la transacción dada como parámetro en la base de datos
 * @param {Transaction} transaction
 * @param {JSON} opts
 */
async function save(transaction, opts = {}) {
  try {
    let transactionSaved = await transaction.save(opts);
    return transactionSaved;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Actualiza la transacción con id igual al como parámetro en la base de datos.
 * @param {String} transactionId id de la transacción a actualizar en la base de datos.
 * @param {JSON} bodyUpdate propiedades de la transacción que se quieren actualizar.
 * @returns transacción actualizada en la base de datos
 */
async function updateTransactionById(transactionId, bodyUpdate, opts = { new: true }) {
  try {
    if (transactionId === null || transactionId === undefined) {
      throw new Error('El id de la transacción que se quiere actualizar no puede ser nulo');
    }

    let transactionUpdated = await Transaction.findByIdAndUpdate(transactionId, bodyUpdate, opts);
    return transactionUpdated;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  getTransactionById,
  getTransactionsSortedByQuery,
  getTransactionsLimitByQuery,
  getDistinctOnTransactions,
  getOneTransactionByQuery,
  save,
  updateTransactionById
}