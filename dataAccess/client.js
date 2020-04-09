'use strict'

const Client = require('../models/client');

//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////DATA ACCESS METHODS///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Recupera los clientes que cumplan con la query dada.
 * @param {JSON} query query para realizar la busqueda.
 * @param {JSON} sortCondition condiciones para ordenar los resultados de la busqueda.
 * @returns clientes recuperados de la base de datos.
 */
async function getClientsSortedByQuery(query, sortCondition) {
  try {
    let clients = await Client.find(query).sort(sortCondition);
    return clients;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Recupera de la base de datos el cliente con id igual al dado como parametro.
 * @param {*} clientId id del cliente que se quiere recuperar de la base de datos.
 */
async function getClientById(clientId) {
  try {
    if (clientId === null || clientId === undefined) {
      throw new Error('El id del cliente que se quiere recuperar no puede ser nulo');
    }
    let client = await Client.findById(clientId);
    return client;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Recupera de la base de datos el cliente con email igual al dado como parametro.
 * @param {*} email id del cliente que se quiere recuperar de la base de datos.
 */
async function getClientByEmail(email) {
  try {
    if (email === null || email === undefined) {
      throw new Error('El Email del cliente que se quiere recuperar no puede ser nulo');
    }
    let client = await Client.find({ email: email })
    return client[0];
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Guarda el cliente dado como parametro en la base de datos.
 * @param {Client} client
 * @returns cliente guardado en la base de datos
 */
async function save(client) {
  try {
    let clientSaved = await client.save();
    return clientSaved;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Actualiza el cliente con id igual al como parámetro en la base de datos.
 * @param {String} clientId id del cliente a actualizar en la base de datos.
 * @param {JSON} bodyUpdate propiedades del cliente que se quieren actualizar.
 * @returns cliente actualizado en la base de datos
 */
async function updateClientById(clientId, bodyUpdate, opts = { new: true }) {
  try {
    if (clientId === null || clientId === undefined) {
      throw new Error('El id del cliente que se quiere actualizar no puede ser nulo');
    }

    let clientUpdated = await Client.findByIdAndUpdate(clientId, bodyUpdate, opts);
    return clientUpdated;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  getClientsSortedByQuery,
  getClientById,
  save,
  updateClientById,
  getClientByEmail
}