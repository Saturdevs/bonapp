'use strict'

const MenuService = require('../../services/menu');
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

module.exports = {
  validateDelete
}