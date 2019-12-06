'use strict'

const SectionDAO = require('../dataAccess/section');
const TableDAO = require('../dataAccess/table');
const mongoose = require('mongoose');

/**
 * @description Recupera todas las salas de la base de datos.
 * @returns salas recuperadas de la base de datos.
 */
async function getAll() {
  try {
    let sections = await SectionDAO.getSectionsByQuery({});

    return sections;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Devuelve la sala con id igual al dado como parámetro.
 * @param {string} sectionId id de la sala que se quiere recuperar.
 */
async function getSection(sectionId) {
  try {
    if (sectionId === null || sectionId === undefined) {
      throw new Error('Se debe especificar el id de la sala que se quiere obtener de la base de datos');
    }

    return await SectionDAO.getSectionById(sectionId);    
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Devuelve la primer mesa que encuentra para la section con id igual al dado como parámetro.
 * @param {string} sectionId 
 * @returns table si existe al menos una mesa para la sección. Null si no existe ninguna.
 */
async function getOneTableBySection(sectionId) {
  try {    
    return TableDAO.getOneTableByQuery({ section: mongoose.Types.ObjectId(sectionId) });
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Actualiza las propiedades dadas como parámetro de la sala con id igual al dado como parámetro.
 * @param {String} sectionId id de la sala a actualizar.
 * @param {JSON} bodyUpdate datos a actualizar en la base de datos.
 * @returns sala actualizada.
 */
async function update(sectionId, bodyUpdate) {
  try {
    return await SectionDAO.updateSectionById(sectionId, bodyUpdate);
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Guarda la sala dada como parámetro en la base de datos.
 * @param {Section} section sala que se quiere guardar en la base de datos.
 * @returns section guardado en la base de datos.
 */
async function saveSection(section) {
  return await SectionDAO.save(section);
}

/**
 * @description Elimina la sala con id igual al dado como parámetro de la base de datos.
 * @param {String} sectionId id de la sala que se quiere eliminar.
 */
async function deleteSection(sectionId) {
  try {
    let section = await SectionDAO.getSectionById(sectionId);
    await SectionDAO.remove(section);
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  getAll,
  getSection,
  getOneTableBySection,
  update,
  saveSection,
  deleteSection
}