'use strict'

const SettingsService = require('../services/settings');
const HttpStatus = require('http-status-codes');

async function getSettings (req, res) {
  try {
    let settings = await SettingsService.getAll();

    if (settings !== null && settings !== undefined) {
      res.status(HttpStatus.OK).send({ settings });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen settings en la base de datos.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}


module.exports = {
  getSettings
}