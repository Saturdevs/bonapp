'use strict'

const ClientService = require('../services/client');
const Client = require('../models/client');
const HttpStatus = require('http-status-codes');

async function getClients(req, res) {
  try {
    let clients = await ClientService.getAll();

    if (clients !== null && clients !== undefined) {
      res.status(HttpStatus.OK).send({ clients });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen clientes registrados en la base de datos.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getWithCurrentAccountEnabled(req, res) {
  try {
    let clients = await ClientService.getWithCurrentAccountEnabled();

    if (clients !== null && clients !== undefined) {
      res.status(HttpStatus.OK).send({ clients });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen clientes con cuentas corrientes habilitadas.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getClient(req, res) {
  try {
    let clientId = req.params.clientId;
    let client = await ClientService.getClient(clientId);

    if (client !== null && client !== undefined) {
      res.status(HttpStatus.OK).send({ client });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `El cliente con id ${clientId} no existe en la base de datos` });
    }
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function saveClient(req, res) {
  try {
    let client = new Client();
    client.name = req.body.name;
    client.tel = req.body.tel || null;
    client.addressStreet = req.body.addressStreet || null;
    client.addressNumber = req.body.addressNumber || null;
    client.addressDpto = req.body.addressDpto || null;
    client.enabledTransactions = req.body.enabledTransactions;
    client.balance = 0;
    client.limitCtaCte = req.body.limitCtaCte;

    let clientSaved = await ClientService.saveClient(client);

    res.status(HttpStatus.OK).send({ client: clientSaved });
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

async function updateClient(req, res) {
  try {
    let clientId = req.params.clientId;
    let bodyUpdate = req.body;

    let clientUpdated = await ClientService.updateClient(clientId, bodyUpdate);
    res.status(HttpStatus.OK).send({ client: clientUpdated });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer actualizar el cliente: ${err.message}.` });
  }
}

async function deleteClient(req, res) {
  try {
    let clientId = req.params.clientId;
    ClientService.deleteClient(clientId);
    res.status(HttpStatus.OK).send({ message: `El cliente ha sido eliminado de la base de datos correctamente.` });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer borrar el cliente de la base de datos: ${err.message}` })
  }
}

module.exports = {
  getClient,
  getClients,
  getWithCurrentAccountEnabled,
  saveClient,
  updateClient,
  deleteClient
}