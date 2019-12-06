'use strict'

const Section = require('../models/section')
const SectionService = require('../services/section');
const HttpStatus = require('http-status-codes');

async function getSections (req, res) {
  try {
    let sections = await SectionService.getAll();

    if (sections !== null && sections !== undefined) {
      res.status(HttpStatus.OK).send({ sections });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen salas almacenadas en la base de datos.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getSection (req, res) {
  try {
    let sectionId = req.params.sectionId;
    let section = await SectionService.getSection(sectionId);

    if (section !== null && section !== undefined) {
      res.status(HttpStatus.OK).send({ section });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `La sala con id ${sectionId} no existe en la base da datos` });
    }
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function saveSection (req, res) {
  try {
    let section = new Section();
    section.name = req.body.name;

    let sectionSaved = await SectionService.saveSection(section);

    res.status(HttpStatus.OK).send({ section: sectionSaved });
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  } 
}

async function updateSection (req, res) {
  try {
    let sectionId = req.params.sectionId;
    let bodyUpdate = req.body

    let sectionUpdated = await SectionService.update(sectionId, bodyUpdate);
    res.status(HttpStatus.OK).send({ section: sectionUpdated });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer actualizar la sala: ${err.message}.` });
  }
}

function deleteSection (req, res) {
  try {
    let sectionId = req.params.sectionId;
    SectionService.deleteSection(sectionId);
    res.status(HttpStatus.OK).send({ message: `La sala ha sido eliminada de la base de datos correctamente.` });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer borrar el producto de la base de datos: ${err.message}` })
  }
}

module.exports = {
  getSection,
  getSections,
  saveSection,
  updateSection,
  deleteSection
}