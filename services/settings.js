'use strict'

const SettingsDAO = require('../dataAccess/settings');
const mongoose = require('mongoose');

/**
 * @description Recupera todas las salas de la base de datos.
 * @returns salas recuperadas de la base de datos.
 */
async function getAll() {
  try {
    let settings = await SettingsDAO.getSettingsByQuery({});

    return settings;
  } catch (err) {
    throw new Error(err);
  }
}


module.exports = {
  getAll
}