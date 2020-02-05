'use strict'

const MenuService = require('../../services/menu');
const CategoryService = require ('../../services/category');
const HttpStatus = require('http-status-codes');

async function validateDelete(req, res, next) {
  try {
    let menuId = req.params.menuId;

    let category = await MenuService.hasAtLeastOneCategory(menuId);

    //Si hay al menos una categoría para este menu, el mismo no puede ser eliminado.
    if (category !== null && category !== undefined) {
      return res.status(HttpStatus.CONFLICT).send({
        message: `No se puede eliminar la carta seleccionada porque tiene categorías asociadas. Marquela como inactiva en su lugar`
      });
    } else {
      next();
    }    
  } catch (err) {
    next(err);
  }
}

async function validateDisable(req, res, next) {
  try {
    let menuId = req.params.menuId;
    let menuAvailable = req.body.available;
    
    if (!menuAvailable) {
      let menu = await MenuService.getMenu(menuId);
      if (menu !== null && menu !== undefined) {
        if (menu.available) {
          //Validacion (si el menu tiene categorias)
          let categories = await CategoryService.getCategoriesAvailablesByMenu(menuId);
          if (categories !== null && categories !== undefined && categories.length > 0) {
            //CONFLICT
            return res.status(HttpStatus.CONFLICT).send({
              message: `El menu ${menu.name} tiene categorias asociadas que se encuentran habilitadas.\n\n\r
              ¿Deseas inhabilitar el menu y todas sus categorias asociadas?`
            });   
          } else {
            next();
          } 
        } else {
          next();
        }
      } else {
        throw new Error(`No se encontro el menu seleccionado.`);
      }
    } else {
      next();
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  validateDelete,
  validateDisable
}