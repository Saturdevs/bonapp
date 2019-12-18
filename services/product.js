'use strict'

const ProductDAO = require('../dataAccess/product');
const OrderDAO = require('../dataAccess/order');
const ProductTransform = require('../transformers/product');
const mongoose = require('mongoose');

/**
 * @description Recupera todos los productos de la base de datos.
 * @returns productos recuperados de la base de datos.
 */
async function getAll() {
  try {
    let productsToReturn = getProductsByQuery({  });  
    return productsToReturn;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Recupera todos los productos para la categoría dada como parámetro.
 * @param categoryId id de la categoría para la que se quieren recuperar los productos.
 * @returns productos para la categoría recuperados de la base de datos.
 */
async function getProductsByCategory(categoryId) {
  try {
    let productsToReturn = getProductsByQuery({ category: categoryId });  
    return productsToReturn;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Recupera todos los productos disponibles para la categoría dada como parámetro.
 * @param categoryId id de la categoría para la que se quieren recuperar los productos disponibles.
 * @returns productos disponibles para la categoría recuperados de la base de datos.
 */
async function getProductsAvailablesByCategory(categoryId) {
  try {
    let productsToReturn = getProductsByQuery({ category: categoryId, available:true });  
    return productsToReturn;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Recupera todos los productos según la query dada.
 * @param query query para recuperar los productos.
 * @returns productos recuperados de la base de datos.
 */
async function getProductsByQuery(query) {
  let productsToReturn = [];
  let products = await ProductDAO.getProductsByQuery(query);

  for (let i = 0; i < products.length; i++) {
    const productTransformed = await ProductTransform.transformToBusinessObject(products[i]);
    productsToReturn.push(productTransformed);
  }

  return productsToReturn;
}

/**
 * @description Devuelve el producto con id igual al dado como parámetro
 * @param {string} productId id del producto que se quiere recuperar.
 */
async function getProduct(productId) {
  try {
    let product = null;
    if (productId === null || productId === undefined) {
      throw new Error('Se debe especificar el id del producto que se quiere obtener de la base de datos');
    }

    product = await ProductDAO.getProductById(productId);

    if (product !== null && product !== undefined) {
      product = ProductTransform.transformToBusinessObject(product);
    }

    return product;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Recupera de la base de datos el primer pedido que se encuentre que tenga el producto dado como parámetro.
 * @param {string} productId 
 * @returns pedido recuperado de la base de datos.
 */
async function existInAnOrder(productId) {
  try {
    let query = { "users.products.product": mongoose.Types.ObjectId(productId) };
    let order = await OrderDAO.getOneOrderByQuery(query);

    return order;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Actualiza el precio de los productos dados como parámetro.
 * @param {Array} productsToUpdate productos para los que se quiere actualizar el precio.
 * @param {Number} updateRate porcentaje de actualización.
 */
async function updatePrice(productsToUpdate, updateRate) {
  try {
    let productsUpdated = [];
    if (productsToUpdate === null || productsToUpdate === undefined) {
      throw new Error('Los productos para los que se quiere actualizar el precio no pueden ser nulos');
    }

    if (updateRate === null || updateRate === undefined) {
      throw new Error('El porcentaje de actualización de precios no puede ser nulo');
    }

    for (let i = 0; i < productsToUpdate.length; i++) {
      const productId = productsToUpdate[i]._id;
      const product = await ProductDAO.getProductById(productId);

      product.price += product.price * updateRate;

      if (product.sizes !== null && product.sizes !== undefined) {
        for (let j = 0; j < product.sizes.length; j++) {
          const size = product.sizes[j];
          size.price += size.price * updateRate;
        }
      }

      productsUpdated.push(await ProductDAO.updateProductById(productId, product));
    }

    return productsUpdated;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Actualiza las propiedades dadas como parámetro del producto con id igual al dado como parámetro.
 * @param {String} productId id del producto a actualizar.
 * @param {JSON} bodyUpdate datos a actualizar en la base de datos.
 * @returns producto actualizado y convertido al modelo usado en el frontend.
 */
async function update(productId, bodyUpdate) {
  try {
    let productUpdated = await ProductDAO.updateProductById(productId, bodyUpdate);

    if (productUpdated !== null && productUpdated !== undefined) {
      productUpdated = ProductTransform.transformToBusinessObject(productUpdated);
    }

    return productUpdated;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Guarda el producto dado como parámetro en la base de datos.
 * @param {Product} product producto que se quiere guardar en la base de datos.
 * @returns producto guardado en la base de datos.
 */
async function saveProduct(product) {
  let productSaved = await ProductDAO.save(product);

  return ProductTransform.transformToBusinessObject(productSaved);
}

/**
 * @description Elimina el producto con id igual al dado como parámetro de la base de datos.
 * @param {String} productId id del producto que se quiere eliminar.
 */
async function deleteProduct(productId) {
  try {
    let product = await ProductDAO.getProductById(productId);
    await ProductDAO.remove(product);
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  getAll,
  getProductsByCategory,
  getProductsAvailablesByCategory,
  getProduct,
  existInAnOrder,
  updatePrice,
  update,
  saveProduct,
  deleteProduct
}