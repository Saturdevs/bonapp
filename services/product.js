'use strict'
const Product = require('../models/product');

/**
 * @description Devuelve un unico producto (sin importar cuantos haya) para el que la categoría sea igual a la 
 * dada como parámetro. Si hay mas de un producto para esa categoría devuelve el primero que encuentra.
 * @param {*} idCategory 
 * @returns primer producto encontrado en la base de datos para la categoria dada como parametro.
 */
async function getOneProductByCategory(idCategory) {
  try {
    let query = { category: idCategory };
    let product = await getOneProductByQuery(query);

    return product;
  } catch (err) {
    throw new Error(err);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Recupera un producto de la base de datos segun el id dado como parametro.  
 * @param {JSON} query 
 * @returns producto recuperado de la base de datos con id igual al dado como parametro.
 */
async function getProductById(productId) {
  try {
    let product = await Product.findById(productId);
    return product;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Recupera un unico producto de la base de datos que cumpla con la query dada como parametro. 
 * Si hay mas de uno devuelve el primero encuentra.
 * @param {JSON} query 
 * @returns primer producto encontrado que cumple con la query dada.
 */
async function getOneProductByQuery(query) {
  try {
    let product = await Product.findOne(query);
    return product;
  }
  catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  getProductById,
  getOneProductByCategory
}