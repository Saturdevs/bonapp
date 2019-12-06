'use strict'

const Product = require('../models/product');

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Recupera los productos de la base de datos según la query dada.
 * @param {JSON} query 
 * @param {JSON} sortCondition condiciones para ordenar los resultados
 * @returns productos recuperados de la base de datos que cumplen con la query dada
 */
async function getProductsByQuery(query, sortCondition = { name: 1 }) {
  try {
    let products = await Product.find(query).sort(sortCondition);
    return products;
  }
  catch (err) {
    handleProductError(err);
  }
}

/**
 * @description Recupera un producto de la base de datos segun el id dado como parametro.  
 * @param {JSON} query 
 * @returns producto recuperado de la base de datos con id igual al dado como parametro.
 */
async function getProductById(productId) {
  try {
    if (productId === null || productId === undefined) {
      throw new Error('El id del producto que se quiere recuperar de la base de datos no puede ser nulo');
    }

    let product = await Product.findById(productId);
    return product;
  }
  catch (err) {
    handleProductError(err);
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
    handleProductError(err);
  }
}

/**
 * @description Actualiza todas las propiedades dadas como parametro en todos los productos que cumplan con la query dada.
 * @param {JSON} query query que determina que productos actualizar.
 * @param {JSON} propertiesToSet propiedades a actualizar.
 * @param {JSON} opts parámetros para realizar el update.
 * @returns medios de pagos actualizados.
 */
async function updateManyProductsByQuery(query, propertiesToSet, opts = { new: true }) {
  try {
    let productsUpdate = await Product.updateMany(query, propertiesToSet, opts);
    return productsUpdate;
  } catch (err) {
    handleProductError(err);
  }
}

/**
 * @description Actualiza el producto en la base de datos segun el id dado.
 * @param {String} productId id del producto a actualizar en la base de datos.
 * @param {JSON} bodyUpdate propiedades del product que se quieren actualizar.
 * @param {JSON} opts parámetros para realizar el update.
 * @returns producto actualizada en la base de datos
 */
async function updateProductById(productId, bodyUpdate, opts = { new: true }) {
  try {
    if (productId === null || productId === undefined) {
      throw new Error('El id del producto que se quiere actualizar no puede ser nulo');
    }

    let productUpdated = await Product.findByIdAndUpdate(productId, bodyUpdate, opts);
    return productUpdated;
  } catch (err) {
    handleProductError(err);
  }
}

/**
 * @description Guarda el producto dado como parametro en la base de datos.
 * @param {Product} product
 */
async function save(product) {
  try {
    if (product === null || product === undefined) {
      throw new Error('El producto que se quiere guardar en la base de datos no puede ser nulo');
    }

    let productSaved = await product.save();
    return productSaved;
  } catch (err) {
    handleProductError(err);
  }
}

/**
 * @description Elmina el producto dado como parametro en la base de datos.
 * @param {Product} product
 */
async function remove(product) {
  try {
    if (product === null || product === undefined) {
      throw new Error('El product que se quiere eliminar de la base de datos no puede ser nulo');
    }

    await product.remove();
  } catch (err) {
    handleProductError(err);
  }
}

function handleProductError(err) {
  if (err.code === 11000) {
    if (err.keyPattern.name !== null && err.keyPattern.name !== undefined) {
      throw new Error(`Ya existe un producto con ese NOMBRE. Ingrese uno distinto por favor.`);
    } else if (err.keyPattern.code !== null && err.keyPattern.code !== undefined) {
      throw new Error(`Ya existe un producto con ese CODIGO. Ingrese uno distinto por favor.`);
    } else {
      throw new Error(err.message);
    }
  } else {
    throw new Error(err.message);
  }
}

module.exports = {
  getProductsByQuery,
  getProductById,
  getOneProductByQuery,
  updateManyProductsByQuery,
  updateProductById,
  save,
  remove
}