'use strict'

const ProductService = require('../../services/product');
const HttpStatus = require('http-status-codes');

async function validateDelete(req, res, next) {
  try {
    let productId = req.params.productId;

    let order = await ProductService.existInAnOrder(productId);

    //Si hay al menos un pedido en el que este el producto que se quiere eliminar, el mismo no puede ser eliminada.
    if (order !== null && order !== undefined) {
      return res.status(HttpStatus.CONFLICT).send({
        message: `No se puede eliminar el producto seleccionado ya que ha sido adicionado en ventas. Marquelo como inactivo en su lugar`
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