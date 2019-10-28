'use strict'

const Arqueo = require('../../models/arqueoCaja');
const ArqueoService = require('../../services/arqueoCaja');
const HttpStatus = require('http-status-codes');

async function validateCreate(req, res, next) {
  try {
    let arqueo = new Arqueo()
    arqueo.cashRegisterId = req.body.cashRegisterId
    arqueo.createdAt = req.body.createdAt;
    arqueo.createdBy = req.body.createdBy
    arqueo.initialAmount = req.body.initialAmount
    arqueo.ingresos = req.body.ingresos
    arqueo.egresos = req.body.egresos
    arqueo.comment = req.body.comment
    arqueo.deleted = false

    let arqueoOpen = await ArqueoService.getArqueoOpenByCashRegister(arqueo.cashRegisterId);

    if (arqueoOpen !== null && arqueoOpen !== undefined) {
      res.status(HttpStatus.CONFLICT).send({ message: `Ya existe un arqueo abierto para la caja registradora seleccionada` });
    } else {
      let currentDate = new Date();

      if (arqueo.createdAt > currentDate) {
        res.status(HttpStatus.CONFLICT).send({ message: `La fecha de apertura del arqueo es mayor a la fecha actual` });
      } else {
        let lastArqueo = await ArqueoService.getLastArqueoByCashRegister(arqueo.cashRegisterId);

        if (lastArqueo !== null && lastArqueo !== undefined) {
          if (arqueo.createdAt < lastArqueo.closedAt) {
            res.status(HttpStatus.CONFLICT).send({ message: `La fecha de apertura del arqueo es menor a la fecha de cierre de un arqueo posterior de la misma caja` });
          } else {
            req.arqueo = arqueo;
            next();
          }
        } else {
          req.arqueo = arqueo;
          next();
        }
      }
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { 
  validateCreate 
}