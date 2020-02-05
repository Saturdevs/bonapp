'use strict'

const Menu = require('../models/menu');
const MenuService = require('../services/menu');
const HttpStatus = require('http-status-codes');

async function getMenus (req, res) {
  try {
    let menus = await MenuService.getAll();

    if (menus !== null && menus !== undefined) {
      res.status(HttpStatus.OK).send({ menus });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen cartas registradas en la base de datos.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getMenusAvailables(req, res) {
  try {
    let menus = await MenuService.getAllAvailables();

    if (menus !== null && menus !== undefined) {
      res.status(HttpStatus.OK).send({ menus });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen cartas habilitadas registradas en la base de datos.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getMenu (req, res) {
  try {
    let menuId = req.params.menuId;
    let menu = await MenuService.getMenu(menuId);

    if (menu !== null && menu !== undefined) {
      res.status(HttpStatus.OK).send({ menu: menu });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `La carta ${menuId} no existe en la base da datos` });
    }
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function hasAtLeastOneCategory(req, res) {
  try {
    let menuId = req.params.menuId;
    let category = await MenuService.hasAtLeastOneCategory(menuId);

    res.status(HttpStatus.OK).send({ category: category });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function saveMenu (req, res) {
  try {
    let menu = new Menu();
    menu.name = req.body.name
    menu.picture = req.body.picture
    menu.available = req.body.available
    
    let menuSaved = await MenuService.saveMenu(menu);

    res.status(HttpStatus.OK).send({ menu: menuSaved });
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

function updateMenu (req, res) {
  let menuId = req.params.menuId
  let bodyUpdate = req.body

  Menu.findByIdAndUpdate(menuId, bodyUpdate, (err, menuUpdated) => {
     if(err){
        if(err['code'] == 11000) 
          return res.status(500).send({ message: `Ya existe un menu con ese nombre. Ingrese otro nombre.` })
      }

    res.status(200).send({ menu: menuUpdated })
  })
}

async function deleteMenu (req, res) {
  try {
    let menuId = req.params.menuId;
    await MenuService.deleteMenu(menuId);
    res.status(HttpStatus.OK).send({ message: `La carta ha sido eliminada de la base de datos correctamente.` });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer borrar la carta de la base de datos: ${err.message}` })
  }
}

async function disableMenuAndCategoriesAndProducts(req, res) {
  try {
    MenuService.disableMenuAndCategoriesAndProducts(req.params.menuId);
    res.status(HttpStatus.OK).send({ message: `El menu ha sido inhabilitado de la base de datos correctamente.` });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer inhabilitar el menu de la base de datos: ${err.message}` })
  }
}

module.exports = {
  getMenu,  
  getMenus,
  getMenusAvailables,
  saveMenu,
  updateMenu,
  deleteMenu,
  hasAtLeastOneCategory,
  disableMenuAndCategoriesAndProducts
}