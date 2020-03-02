'use strict'

/**
 * @module Cash Counts
 */

const ArqueoService = require('../services/arqueoCaja');
const HttpStatus = require('http-status-codes');

/** 
 * @method
 * @description Devuelve todos los arqueos no eliminados.
 * @return {json} arqueos
 */
async function getArqueos(req, res) {
  try {
    let arqueos = await ArqueoService.getNotDeletedArqueos();

    if (arqueos !== null && arqueos !== undefined) {
      res.status(HttpStatus.OK).send({ arqueos });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen arqueos no eliminados en la base de datos.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

/** 
 * @method
 * @description Devuelve el arqueo correspondiente al id dado.
 * @param req.params.arqueoId {objectID} Id del arqueo a buscar.
 * @return {json} arqueo
 */
async function getArqueo(req, res) {
  try {
    let arqueoId = req.params.arqueoId
    let arqueo = await ArqueoService.getArqueo(arqueoId);

    if (arqueo !== null && arqueo !== undefined) {
      res.status(HttpStatus.OK).send({ arqueo });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `El arqueo ${arqueoId} no existe en la base da datos` });
    }
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

/** 
 * @method
 * @description Devuelve el arqueo que se encuentra abierto correspondiente a la caja registradora enviada como parámetro.
 * @param req.params.cashRegisterId {objectID} Es el id de la caja registradora.
 * @return {json} json
 */
async function getArqueoOpenByCashRegister(req, res) {
  try {
    let cashRegisterId = req.params.cashRegisterId
    let arqueo = await ArqueoService.getArqueoOpenByCashRegister(cashRegisterId);

    res.status(HttpStatus.OK).send({ arqueo });
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

/** 
 * @method
 * @description Inserta un arqueo nuevo en la base de datos.
 * @param req.body Arqueo a insertar.
 * @return {json} arqueo: arqueoStored
 */
async function saveArqueo(req, res) {
  try {
    let arqueo = req.arqueo;
    let arqueoSaved = await ArqueoService.save(arqueo);

    res.status(HttpStatus.OK).send({ arqueo: arqueoSaved });
  } 
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer guardar el arqueo: ${err}.` });
  }
}

/** 
 * @method
 * @description Actualiza el arqueo en la base de datos correspondiente al id enviado como parámetro.
 * @param req.params.arqueoId Es el id del arqueo a actualizar.
 * @param req.body Es el arqueo a actualizar.
 * @return {json} arqueo: arqueoUpdated
 */
async function updateArqueo(req, res) {
  try {
    let arqueoId = req.params.arqueoId;
    let bodyUpdate = req.body;

    let arqueoUpdated = await ArqueoService.update(arqueoId, bodyUpdate);
    res.status(HttpStatus.OK).send({ arqueo: arqueoUpdated });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer actualizar el arqueo: ${err}.` });
  }
}

async function logicalDeleteArqueo (req, res) {
  try {
    let arqueoId = req.params.arqueoId;

    let arqueoUpdated = await ArqueoService.logicalDelete(arqueoId);
    res.status(HttpStatus.OK).send({ message: `El arqueo ha sido eliminado de la base de datos` });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer borrar el arqueo de la base de datos: ${err}` })    
  }
}

/** 
 * @method
 * @description Elimina el arqueo de la base de datos correspondiente al id enviado como parámetro.
 * @param req.params.arqueoId Es el id del arqueo a eliminar.
 */
function deleteArqueo(req, res) {
  try {
    let arqueoId = req.params.arqueoId;
    ArqueoService.deleteArqueo(arqueoId);
    res.status(HttpStatus.OK).send({ message: `El arqueo ha sido eliminado` });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer borrar el arqueo: ${err}` })    
  }
}

module.exports = {
  getArqueo,
  getArqueos,
  getArqueoOpenByCashRegister,
  saveArqueo,
  updateArqueo,
  deleteArqueo,
  logicalDeleteArqueo
}