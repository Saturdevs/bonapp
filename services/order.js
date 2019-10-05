'use strict'
const Order = require('../models/order');
const orderStatus = require('../shared/enums/orderStatus');
const productService = require('../services/product');
const cashRegisterService = require('../services/cashRegister');
const userService = require('../services/user');

/**
 * Crea y guarda en la base de datos un pedido nuevo a partir del objeto recibido 
 * desde el front-end.
 * @param {*} order pedido a crear recibido desde el front end
 */
async function createOrder(order) {
  try {
    let newOrder = new Order();
    newOrder.users = { id: String, username: String };
    let lastOrder = await getLastOrder();

    if (lastOrder === null || lastOrder === undefined) {
      newOrder.orderNumber = 1;
    }
    else {
      newOrder.orderNumber = lastOrder.orderNumber + 1;
    }

    newOrder.type = order.type;
    newOrder.table = order.table;
    newOrder.waiter = order.waiter;
    newOrder.status = orderStatus.OPEN;
    newOrder.users = order.users;
    newOrder.app = order.app;
    newOrder.created_at = new Date();

    const orderSaved = await newOrder.save();

    return transformToBusinessObject(orderSaved);
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Hace el update del pedido cuando se agregan o eliminan productos.
 * @param {*} order pedido con los productos y precio total actualizado enviado desde el front end
 */
async function updateOrderProducts(order) {
  try {
    let ord = new Order();
    let orderUpdated = new Order();

    ord._id = order._id;
    ord.users = updateProducts(order);
    ord.totalPrice = order.totalPrice;

    orderUpdated = await update(ord);

    return transformToBusinessObject(orderUpdated);
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Actualiza los productos para cada usuario dentro del pedido.
 * @param {*} order pedido enviado desde el front end
 */
function updateProducts(order) {
  let users = new Array();

  order.users.forEach(user => {
    let usr = {};
    let products = new Array();

    user.products.forEach(product => {
      let prod = {};

      prod.product = product.product;
      prod.options = product.options;
      prod.price = product.price;
      prod.size = product.size;
      prod.observations = product.observations;
      prod.quantity = product.quantity;
      prod.deleted = product.deleted;
      prod.deletedReason = product.deletedReason;

      products.push(prod);
    })

    usr.user = user.user;
    usr.products = products;
    usr.totalPerUser = user.totalPerUser;
    usr.payments = user.payments;
    usr.owner = user.owner;

    users.push(usr);
  })

  return users;
}

/**
 * Recupera de la base de datos los pedidos segund el estado dado como parámetro 
 * para la mesa dada como parámetro.
 * @param {Number} tableNro nro de mesa
 * @param {String} status estado del pedido a buscar
 */
async function getOrdersByTableByStatus(tableNro, status) {
  try {
    let ordersReturned = [];
    let query = { table: tableNro, status: status };
    let orders = await getOrderByQuery(query);

    orders.forEach(order => {
      ordersReturned.push(transformToBusinessObject(order));
    })

    return ordersReturned;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Recupera el pedido abierto para una mesa dada.
 * Si hay mas de un pedido abierto para la mesa se devuelve error.
 * @param {Number} tableNro número de mesa para la cual se quiere recuperar el pedido abierto.
 */
async function getOpenedOrderForTable(tableNro) {
  try {
    let query = { table: tableNro, status: orderStatus.OPEN };
    let order = await getOrderByQuery(query);

    if (order.length > 1) {
      throw new Error(`Existe mas de un pedido abierto para la mesa número ${tableNro}`);
    }

    if (order.length === 0) {
      return null;
    }
    else {
      return transformToBusinessObject(order[0]);
    }
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Actualiza el pedido dado en la base de datos.
 * @param {*} order 
 */
async function updateOrder(order) {
  try {
    let orderUpdated = await update(order);

    return transformToBusinessObject(orderUpdated);
  }
  catch (err) {
    throw new Error(err);
  }
}

async function closeOrder(order) {
  if (order.cashRegister === null || order.cashRegister === 'undefined') {
    throw new Error("Se debe seleccionar una caja registradora para hacer el cierre del pedido");
  }

  let paymentFound = false;
  let ord = new Order();
  let users = new Array;
  let orderUpdated = new Order();
  users = [];

  order.users.forEach(user => {
    if (user.payments !== null && user.payments !== 'undefined' && !paymentFound) {
      paymentFound = true;
    }

    let usr = {};
    let products = new Array;
    products = [];

    user.products.forEach(product => {
      let prod = {};      

      prod.product = product.product;
      prod.options = product.options;
      prod.price = product.price;
      prod.size = product.size;
      prod.observations = product.observations;
      prod.quantity = product.quantity;
      prod.deleted = product.deleted;
      prod.deletedReason = product.deletedReason;

      products.push(prod);
    })

    usr.user = user.user;
    usr.products = products;
    usr.totalPerUser = user.totalPerUser;
    usr.payments = user.payments;
    usr.owner = user.owner;

    users.push(usr);
  })

  if(!paymentFound) {
    throw new Error("Se debe seleccionar al menos un tipo de pago para hacer el cierre del pedido");
  }

  ord._id = order._id;
  ord.cashRegister = order.cashRegister._id;
  ord.status = order.status;
  ord.users = users;
  ord.sent_at = order.sent_at;
  ord.completed_at = order.completed_at;
  ord.discount = order.discount;
  ord.totalPrice = order.totalPrice;

  orderUpdated = await update(order);
  return transformToBusinessObject(orderUpdated);
}

/**
 * Transforma el pedido recuperado de la base de datos en el objeto pedido usado en el front end.
 * @param {*} orderEntity 
 */
async function transformToBusinessObject(orderEntity) {
  if (orderEntity !== null && orderEntity !== 'undefined') {
    let order = {};
    let users = [];

    orderEntity.users.forEach(user => {
      let usr = {};
      let products = [];

      user.products.forEach(async product => {
        let prod = {};

        let productStored = await productService.getProductById(product.product);

        prod.product = productStored._id;
        prod.name = productStored.name;
        prod.options = product.options;
        prod.price = product.price;
        prod.size = product.size;
        prod.observations = product.observations;
        prod.quantity = product.quantity;
        prod.deleted = product.deleted;
        prod.deletedReason = product.deletedReason;

        products.push(prod);
      })

      usr.user = {};
      usr.user.id = user.user.id;
      usr.user.username = user.user.username;
      usr.products = products;
      usr.totalPerUser = user.totalPerUser;
      usr.payments = user.payments;
      usr.owner = user.owner

      users.push(usr);
    })

    order._id = orderEntity._id;
    order.orderNumber = orderEntity.orderNumber;
    order.type = orderEntity.type;
    order.table = orderEntity.table;
    order.cashRegister = orderEntity.cashRegister;
    order.waiter = orderEntity.waiter;
    order.status = orderEntity.status;
    order.app = orderEntity.app;
    order.users = users;
    order.created_at = orderEntity.created_at;
    order.sent_at = orderEntity.sent_at;
    order.completed_at = orderEntity.completed_at;
    order.discount = orderEntity.discount;
    order.totalPrice = orderEntity.totalPrice;

    order.cashRegister = (orderEntity.cashRegister !== null && orderEntity.cashRegister !== 'undefined') ?
      await cashRegisterService.getCashRegisterById(orderEntity.cashRegister) :
      null;

    order.waiter = (orderEntity.waiter !== null && orderEntity.waiter !== 'undefined') ?
      await userService.getUserById(orderEntity.waiter) :
      null;

    return order;
  }
}

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
  createOrder,
  updateOrderProducts,
  updateOrder,
  closeOrder,
  getOrdersByTableByStatus,
  getOpenedOrderForTable
}