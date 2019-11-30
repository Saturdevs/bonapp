'use strict'

const mongoose = require('mongoose');
const Transaction = require('../models/transaction');
const TransactionTransform = require('../transformers/transaction');
const CashCountService = require('../services/arqueoCaja');
const CashInTypes = require('../shared/enums/cashInTypes');
const ClientDAO = require('../dataAccess/client');
const TransactionDAO = require('../dataAccess/transaction');

async function getAll() {
  try {
    let transactionsToReturn = [];
    let sortCondition = { date: -1 };
    let transactions = await TransactionDAO.getTransactionsSortedByQuery({ deleted: false }, sortCondition);

    if (transactions !== null && transactions !== undefined) {
      for (let i = 0; i < transactions.length; i++) {
        const categoryTransformed = await TransactionTransform.transformToBusinessObject(transactions[i]);
        transactionsToReturn.push(categoryTransformed);
      }
    }

    return transactionsToReturn;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Recupera las transacciontes con fecha posterior a la fecha dada.
 * @param {Date} date 
 * @returns {Transaction[]} transacciones recuperadas de la base de datos
 */
async function getTransactionsByDate(date) {
  try {
    let query = { date: { "$gte": date } };
    let transactions = await TransactionDAO.getTransactionsSortedByQuery(query, { date: -1 });

    return transactions;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Recupera la primer transacción que se encuentre en la bd realizadas en la caja registradora con id igual 
 * al dado como parámetro
 * @param {string} cashRegisterId 
 * @returns {Transaction} trnsaction recuperado de la base de datos
 */
async function getFirstTransactionByCashRegister(cashRegisterId) {
  try {
    let query = { cashRegister: mongoose.Types.ObjectId(cashRegisterId) };
    let transaccion = await TransactionDAO.getTransactionsLimitByQuery(query, {}, 1);

    return transaccion;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Recupera de la base de datos la transacción con id igual al dado como parámetro.
 * @param {string} transactionId id de la transacción que se quiere recuperar.
 * @returns transacción recuperada de la base de datos transformada.
 */
async function getTransaction(transactionId) {
  try {
    let transaction = null;
    if (transactionId === null || transactionId === undefined) {
      throw new Error('Se debe especificar el id de la transacción que se quiere obtener de la base de datos');
    }

    transaction = await TransactionDAO.getTransactionById(transactionId);

    return TransactionTransform.transformToBusinessObject(transaction);
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Devuelve los distintos ids de los clientes que tienen al menos una transacción
 * @returns id de los clientes que tienen transacciones
 */
async function getDistinctClientsWithTransactions() {
  let field = "client._id";
  let query = { deleted: false };

  let clientIds = await TransactionDAO.getDistinctOnTransactions(field, query);

  return clientIds;
}

/**
 * @description 
 * @param {Transaction} transaction
 * @returns transacción guardada en la base de datos.
 */
async function saveTransaction(transaction) {
  const session = await mongoose.startSession();
  const collection = await mongoose.connection.db.listCollections({ name: "transaction" }).toArray();
  if (collection === null || collection === undefined || collection.length === 0) {
    await Transaction.createCollection();
  }
  session.startTransaction();
  try {
    const opts = { session: session, new: true };

    let cashCount = await CashCountService.getArqueoOpenByCashRegister(transaction.cashRegister);
    if (cashCount !== null && cashCount !== undefined) {
      let ingreso = {
        paymentType: transaction.paymentMethod,
        desc: CashInTypes.COBROS_CLIENTES_CTA_CTE,
        amount: transaction.amount,
        date: transaction.date
      }

      cashCount.ingresos.push(ingreso);
      await CashCountService.update(cashCount._id, { ingresos: cashCount.ingresos }, opts);
    }

    let client = await ClientDAO.getClientById(transaction.client);
    if (client !== null && client !== undefined) {
      if (client.balance === null || client.balance === undefined) {
        client.balance = 0;
      }

      client.balance += transaction.amount;
      await ClientDAO.updateClientById(client._id, { balance: client.balance }, opts);
    } else {
      throw new Error('El cliente para el que se quiere agregar una nueva transacción no se ha podido encontrar en la base de datos.');
    }

    await TransactionDAO.save(transaction, opts);

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

/**
 * @description Realiza la baja lógica la transacción con id igual al dado como parámetro de la base de datos.
 * Setea la propiedad deleted = true.
 * @param {String} transactionId id de la transacción que se quiere eliminar
 */
async function deleteTransaction(transactionId) {
  const session = await mongoose.startSession();    
  session.startTransaction();
  try {
    const opts = { session: session, new: true };    
    let transaction = await TransactionDAO.getTransactionById(transactionId);

    if (transaction === null || transaction === undefined) {
      throw new Error('La transacción que desea eliminar no se ha podido encontrar en la base de datos. Intente nuevamente.');
    }

    let cashCount = await CashCountService.getArqueoOpenByCashRegister(transaction.cashRegister);
    if (cashCount !== null && cashCount !== undefined) {
      let ingreso = {
        paymentType: transaction.paymentMethod,
        desc: CashInTypes.COBROS_CLIENTES_CTA_CTE,
        amount: transaction.amount,
        date: transaction.date
      }

      //Si existe un ingreso registrado en el arqueo de caja abierto para la caja de la transacción 
      //lo elimino.
      let index = await ingresoIndex(cashCount.ingresos, ingreso);
      if (index !== -1) {
        cashCount.ingresos.splice(index, 1);
      }
      await CashCountService.update(cashCount._id, { ingresos: cashCount.ingresos }, opts);
    }

    let client = await ClientDAO.getClientById(transaction.client);
    if (client !== null && client !== undefined) {
      if (client.balance === null || client.balance === undefined) {
        client.balance = 0;
      }

      client.balance -= transaction.amount;
      await ClientDAO.updateClientById(client._id, { balance: client.balance }, opts);
    } else {
      throw new Error('El cliente de la transacción que se desea elimnar no se ha podido encontrar en la base de datos.');
    }

    await TransactionDAO.updateTransactionById(transactionId, { deleted: true }, opts);
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Devuelve el índice del ingreso dado como parámetro en el array de ingresos 
 * dado como parámetro.
 * @param {Array} cashCountIngresos array de ingresos.
 * @param {JSON} ingreso ingreso del que se quiere obtener el índice.
 * @returns índice del ingreso si existe en el array dado. -1 si no existe
 */
async function ingresoIndex(cashCountIngresos, ingreso) {
  let index = -1;

  for (let i = 0; i < cashCountIngresos.length && index === -1; i++) {
    const ing = cashCountIngresos[i];
    
    if (ingreso.paymentType.toString() === ing.paymentType.toString() &&
        ingreso.desc === ing.desc &&
        ingreso.amount === ing.amount &&
        ingreso.date.toString() === ing.date.toString()) {

          index = i;
        }
  }

  return index;
}

module.exports = {
  getAll,
  getTransaction,
  getDistinctClientsWithTransactions,
  getTransactionsByDate,
  getFirstTransactionByCashRegister,
  saveTransaction,
  deleteTransaction
}