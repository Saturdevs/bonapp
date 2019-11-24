'use strict'

const Client = require('../models/client');

/**
 * @description Devuelve todos los clientes almacenados en la base de datos.
 * @returns clientes recuperados de la base de datos transformados al modelo que se usa en el frontend.
 */
async function getAll() {
  try {
    let sortCondition = { name: 1 };
    let clients = await getClientsSortedByQuery({}, sortCondition);

    return clients;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Recupera todos los clientes con cuenta corriente almacenados en la base de datos.
 * @returns clientes recuperados de la base de datos transformados al modelo que se usa en el frontend.
 */
async function getWithCurrentAccountEnabled() {
  try {
    let query = { enabledTransactions: true };
    let sortCondition = { name: 1 };
    let clients = await getClientsSortedByQuery(query, sortCondition);

    return clients;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Devuelve el cliente almacenado en la base de datos con id igual al dado como parametro.
 * @param {string} clientId id del cliente que se quiere recuperar.
 * @returns cliente recuperado de la base de datos transformado.
 */
async function getClient(clientId) {
  try {
    let client = null;
    if (clientId === null || clientId === undefined) {
      throw new Error('Se debe especificar el id del cliente que se quiere obtener de la base de datos');
    }

    client = await getClientById(clientId);

    return client;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Crea un nuevo cliente con los datos dados como parametros y lo guarda en la base de datos.
 * @param {Client} client
 * @returns client guardado en la base de datos.
 */
async function saveClient(client) {
  let clientSaved = await save(client);

  return clientSaved;
}

/**
 * @description Actualiza el cliente con id igual al dado como parametro en la base de datos.
 * @param {String} clientId id del cliente a actualizar.
 * @param {JSON} bodyUpdate datos a actualizar en la base de datos.
 * @returns cliente actualizado en la base de datos.
 */
async function updateClient(clientId, bodyUpdate) {
  try {
    let clientUpdated = await updateClientById(clientId, bodyUpdate);

    return clientUpdated;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Elimina el cliente con id igual al dado como parametro de la base de datos.
 * @param {String} clientId id del cliente que se quiere eliminar
 */
async function deleteClient(clientId) {
  try {
    let client = await getClientById(clientId);
    await client.remove();
  } catch (err) {
    throw new Error(err.message);
  }
}

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
  getAll,
  getWithCurrentAccountEnabled,
  getClient,
  getClientById,
  saveClient,
  updateClient,
  updateClientById,
  deleteClient
}