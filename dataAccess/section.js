'use strict'

const Section = require('../models/section');

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Recupera las salas de la base de datos según la query dada.
 * @param {JSON} query 
 * @param {JSON} sortCondition condiciones para ordenar los resultados
 * @returns salas recuperadas de la base de datos que cumplen con la query dada
 */
async function getSectionsByQuery(query, sortCondition = { name: 1 }) {
  try {
    let sections = await Section.find(query).sort(sortCondition);
    return sections;
  }
  catch (err) {
    handleProductError(err);
  }
}

/**
 * @description Recupera una sala de la base de datos segun el id dado como parametro.  
 * @param {JSON} sectionId id de la sala que se quiere recuperar de la base de datos.
 * @returns sala recuperada de la base de datos con id igual al dado como parametro.
 */
async function getSectionById(sectionId) {
  try {
    if (sectionId === null || sectionId === undefined) {
      throw new Error('El id de la sala que se quiere recuperar de la base de datos no puede ser nulo');
    }

    let section = await Section.findById(sectionId);
    return section;
  }
  catch (err) {
    handleProductError(err);
  }
}

/**
 * @description Actualiza la sala en la base de datos segun el id dado.
 * @param {String} sectionId id de la sala a actualizar en la base de datos.
 * @param {JSON} bodyUpdate propiedades de la sala que se quieren actualizar.
 * @param {JSON} opts parámetros para realizar el update.
 * @returns sala actualizada en la base de datos
 */
async function updateSectionById(sectionId, bodyUpdate, opts = { new: true }) {
  try {
    if (sectionId === null || sectionId === undefined) {
      throw new Error('El id de la sala que se quiere actualizar no puede ser nulo');
    }

    return await Section.findByIdAndUpdate(sectionId, bodyUpdate, opts);    
  } catch (err) {
    handleProductError(err);
  }
}

/**
 * @description Guarda la sala dada como parametro en la base de datos.
 * @param {Section} section
 */
async function save(section) {
  try {
    if (section === null || section === undefined) {
      throw new Error('La sala que se quiere guardar en la base de datos no puede ser nula');
    }

    let sectionSaved = await section.save();
    return sectionSaved;
  } catch (err) {
    handleProductError(err);
  }
}

/**
 * @description Elimina la sala dada como parametro de la base de datos.
 * @param {Section} section
 */
async function remove(section) {
  try {
    if (section === null || section === undefined) {
      throw new Error('La sala que se quiere eliminar de la base de datos no puede ser nula');
    }

    await section.remove();
  } catch (err) {
    handleProductError(err);
  }
}

function handleProductError(err) {
  if (err.code === 11000) {
    if (err.keyPattern.name !== null && err.keyPattern.name !== undefined) {
      throw new Error(`Ya existe una sala con ese NOMBRE. Ingrese uno distinto por favor.`);
    } else {
      throw new Error(err.message);
    }
  } else {
    throw new Error(err.message);
  }
}

module.exports = {
  getSectionsByQuery,
  getSectionById,
  updateSectionById,
  save,
  remove
}