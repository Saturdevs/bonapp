'use strict'

const CategoryService = require('../../services/category');
const HttpStatus = require('http-status-codes');

async function validateDelete(req, res, next) {
  try {
    let categoryId = req.params.categoryId;

    let product = await CategoryService.hasAtLeastOneProduct(categoryId);

    //Si hay al menos un producto para esta categoria, la misma no puede ser eliminada.
    if (product !== null && product !== undefined) {
      return res.status(HttpStatus.CONFLICT).send({
        message: `No se puede eliminar la categoría seleccionada porque tiene productos asociados. Marquela como inactiva en su lugar`
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