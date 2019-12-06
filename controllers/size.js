'use strict'

const Size = require('../models/size')
const SizeService = require('../services/size');
const HttpStatus = require('http-status-codes');

async function getSizes(req, res) {
  try {
    let sizes = await SizeService.getAll();

    if (sizes !== null && sizes !== undefined) {
      res.status(HttpStatus.OK).send({ sizes });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen tamaños almacenadas en la base de datos.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getSize(req, res) {
  try {
    let sizeId = req.params.sizeId;
    let size = await SizeService.getSize(sizeId);

    if (size !== null && size !== undefined) {
      res.status(HttpStatus.OK).send({ size });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `El tamaño con id ${sizeId} no existe en la base da datos` });
    }
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function saveSize(req, res) {
  try {
    let size = new Size();
    size.name = req.body.name;
    size.available = req.body.available;

    let sizeSaved = await SizeService.saveSize(size);

    res.status(HttpStatus.OK).send({ size: sizeSaved });
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

async function updateSize(req, res) {
  try {
    let sizeId = req.params.sizeId;
    let bodyUpdate = req.body

    let sizeUpdated = await SizeService.update(sizeId, bodyUpdate);
    res.status(HttpStatus.OK).send({ size: sizeUpdated });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer actualizar el tamaño: ${err.message}.` });
  }
}

async function deleteSize(req, res) {
  try {
    let sizeId = req.params.sizeId;
    SizeService.deleteSize(sizeId);
    res.status(HttpStatus.OK).send({ message: `El tamaño ha sido eliminado de la base de datos correctamente.` });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer borrar el producto de la base de datos: ${err.message}` })
  }
}

module.exports = {
  getSizes,
  getSize,
  saveSize,
  updateSize,
  deleteSize
}