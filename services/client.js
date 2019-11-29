'use strict'

const ClientDAO = require('../dataAccess/client');

/**
 * @description Devuelve todos los clientes almacenados en la base de datos.
 * @returns clientes recuperados de la base de datos transformados al modelo que se usa en el frontend.
 */
async function getAll() {
  try {
    let sortCondition = { name: 1 };
    let clients = await ClientDAO.getClientsSortedByQuery({}, sortCondition);

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
    let clients = await ClientDAO.getClientsSortedByQuery(query, sortCondition);

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

    client = await ClientDAO.getClientById(clientId);

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
  let clientSaved = await ClientDAO.save(client);

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
    let clientUpdated = await ClientDAO.updateClientById(clientId, bodyUpdate);

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
    let client = await ClientDAO.getClientById(clientId);
    await client.remove();
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  getAll,
  getWithCurrentAccountEnabled,
  getClient,
  saveClient,
  updateClient,
  deleteClient
}