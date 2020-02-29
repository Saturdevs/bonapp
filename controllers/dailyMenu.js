'use strict'

const DailyMenuService = require('../services/dailyMenu');
const HttpStatus = require('http-status-codes');

async function getDailyMenus(req, res) {
  try {
    let dailyMenus = await DailyMenuService.getAll();

    if (dailyMenus !== null && dailyMenus !== undefined) {
      res.status(HttpStatus.OK).send({ dailyMenus });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen menues del dia almacenados en la DB.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getAvailableDailyMenus(req, res) {
  try {
    let dailyMenus = await DailyMenuService.getAvailableDailyMenus();

    if (dailyMenus !== null && dailyMenus !== undefined) {
      res.status(HttpStatus.OK).send({ dailyMenus });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen menues del dia habilitados.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getDailyMenu(req, res) {
  try {
    let dailyMenuId = req.params.dailyMenuId
    let dailyMenu = await DailyMenuService.getDailyMenu(dailyMenuId);

    if (dailyMenu !== null && dailyMenu !== undefined) {
      res.status(HttpStatus.OK).send({ dailyMenu });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `El menu del dia ${dailyMenuId} no existe en la base de datos.` });
    }
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function saveDailyMenu(req, res) {
  try {
    let today = new Date();
    let tomorrow = new Date().setDate(new Date().getDate() + 1);
    req.body.startDate = today;
    req.body.endDate = tomorrow;
    let dailyMenuSaved = await DailyMenuService.saveDailyMenu(req.body);

    res.status(HttpStatus.OK).send({ dailyMenu: dailyMenuSaved });
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

async function updateDailyMenu(req, res) {
  try {
    let dailyMenuId = req.params.dailyMenuId;
    let bodyUpdate = req.body;

    let dailyMenuUpdated = await DailyMenuService.update(dailyMenuId, bodyUpdate);
    res.status(HttpStatus.OK).send({ dailyMenu: dailyMenuUpdated });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer actualizar el menu del dia: ${err}.` });
  }
}

module.exports = {
  getDailyMenu,
  getDailyMenus,
  getAvailableDailyMenus,
  saveDailyMenu,
  updateDailyMenu
}