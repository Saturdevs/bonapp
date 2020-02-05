'use strict'

const CategoryService = require('../../services/category');
const ProductService = require('../../services/product');
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

async function validateDisable(req, res, next) {
  try {
    let categoryId = req.params.categoryId;
    let categoryAvailable = req.body.available;
    
    if (!categoryAvailable) {
      let category = await CategoryService.getCategory(categoryId);
      if (category !== null && category !== undefined) {
        if (category.available) {
          //Validacion (si la categoria tiene productos)
          let products = await ProductService.getProductsAvailablesByCategory(categoryId);
          if (products !== null && products !== undefined && products.length > 0) {
            //CONFLICT
            return res.status(HttpStatus.CONFLICT).send({
              message: `La categoría ${category.name} tiene productos asociados que se encuentran habilitados.\n\n\r
              ¿Deseas inhabilitar la categoría y todos sus productos asociados?`
            });   
          } else {
            next();
          } 
        } else {
          next();
        }
      } else {
        throw new Error(`No se encontro la categoria seleccionada.`);
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