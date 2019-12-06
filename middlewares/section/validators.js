'use strict'

const SectionService = require('../../services/section');
const HttpStatus = require('http-status-codes');

async function validateDelete(req, res, next) {
  try {
    let sectionId = req.params.sectionId;   
    
    let table = await SectionService.getOneTableBySection(sectionId);

    //Si hay al menos una mesa para la sala que se quiere eliminar, la operación no puede realizarse.
    if (table !== null && table !== undefined) {
      return res.status(HttpStatus.CONFLICT).send({
        message: `La sala no puede ser eliminada porque todavía tiene mesas asociadas.`
      });
    } else {
      next();
    }   
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateDelete
}