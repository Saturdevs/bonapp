'use strict'

const Order = require('../models/order');

//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////DATA ACCESS METHODS///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Recupera el pedido de la base de datos según la query dada.
 * @param {JSON} query 
 */
async function getOrderByQuery(query) {
  try {
    let orders = await Order.find(query);
    return orders;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Recupera un unico pedido que cumpla con la query dada como parametro. Si hay mas de uno devuelve el primero
 * encuentra.
 * @param {JSON} query 
 * @returns primer pedido encontrado que cumple con la query dada.
 */
async function getOneOrderByQuery(query) {
  try {
    let order = await Order.findOne(query);
    return order;
  }
  catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Recupera el último pedido de la base de datos.
 */
async function getLastOrder() {
  try {
    let orders = await Order.find().sort({ orderNumber: -1 }).limit(1).exec();
    return orders[0];
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Actualiza el pedido dado como parámetro en la base de datos
 * @param {*} orderToUpdate 
 */
async function update(orderToUpdate) {
  try {
    let orderUpdated = new Order();
    orderUpdated = await Order.findByIdAndUpdate(orderToUpdate._id, orderToUpdate, { new: true });
    return orderUpdated;
  }
  catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  getOrderByQuery,
  getOneOrderByQuery,
  getLastOrder,
  update
}