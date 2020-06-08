'use strict'

const Settings = require('../models/settings');

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Recupera las salas de la base de datos según la query dada.
 * @param {JSON} query 
 * @param {JSON} sortCondition condiciones para ordenar los resultados
 * @returns salas recuperadas de la base de datos que cumplen con la query dada
 */
async function getSettingsByQuery(query, sortCondition = { name: 1 }) {
  try {
    let settings = await Settings.find(query).sort(sortCondition);
    return settings;
  }
  catch (err) {
    handleProductError(err);
  }
}

module.exports = {
  getSettingsByQuery
}