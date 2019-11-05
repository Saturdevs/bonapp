'use strict'

const Client = require('../models/client');

/**
 * Recupera los clientes que tienen transacciones con fecha posterior a la fecha dada.
 * @param {Date} date 
 * @returns {Client[]} clientes recuperados de la base de datos
 */
async function getTransactionsByDate(date) {
  try {
    let query = [
      {$match: {"transactions.date": { "$gte": date }}}, 
      {$project: {
        transactions: {$filter: { 
          input: "$transactions",
          as: "transactions",
          cond: {$gt: ["$$transactions.date", date]}
        }}
      }}
    ];
    let clients = await getUsingAggregate(query);

    return clients;
  }
  catch (err) {
    throw new Error(err);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////DATA ACCESS METHODS///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Recupera los clientes de cajas que cumplan con la query dada.
 * @param {JSON} query 
 */
async function getClientByQuery(query) {
  try {
    let clients = await Client.find(query);
    return clients;
  }
  catch (err) {
    throw new Error(err);
  }
}

async function getUsingAggregate(query) {
  try {
    let result = await Client.aggregate(query);
    return result    
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  getTransactionsByDate
}