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
 * @param {*} order pedido para el que se tienen q actualizar los productos
 * @param {*} productsToAdd productos que se deben agregar al pedido
 * @param {*} username username del user para el que se deben agregar los productos
 * @param {*} totalToAdd suma total de los montos de todos los productos que debe ser agregado al totalPrice del pedido
 * @returns pedido actualizado
 */
async function updateOrderProducts(order, productsToAdd, username, totalToAdd) {
  try {
    let ord = new Order();
    let orderUpdated = new Order();

    ord._id = order._id;
    ord.users = updateProducts(order, productsToAdd, username, totalToAdd);
    if (order.totalPrice === null || order.totalPrice === undefined) {
      order.totalPrice = 0;
    }

    ord.totalPrice = order.totalPrice + totalToAdd;

    orderUpdated = await update(ord);

    return transformToBusinessObject(orderUpdated);
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Actualiza los productos para cada usuario dentro del pedido.
 * @param {*} order pedido para el que se tienen q actualizar los productos
 * @param {*} productsToAdd productos que se deben agregar al pedido
 * @param {*} username username del user para el que se deben agregar los productos
 * @param {*} totalToAdd monto total a pagar por los productos agregados
 * @returns el array de usuarios del pedido con sus productos actualizados
 */
function updateProducts(order, productsToAdd, username, totalToAdd) {

  let userFound = false;
  let ownerFound = false;

  for (let i = 0; i < order.users.length; i++) {
    let user = order.users[i];

    //Verifico si ya existe un un user owner para el pedido
    if (user.owner) {
      ownerFound = true;
    }

    if (user.username === username) {
      userFound = true;
      if (user.totalPerUser === null || user.totalPerUser === undefined) {
        user.totalPerUser = 0;
      }
      user.totalPerUser += totalToAdd;

      productsToAdd.forEach(product => {
        if (product.size === null || product.size === undefined) {
          product.size = { name: undefined, price: undefined };
        }
        //Verifico si el usuario ya tiene productos agregados al pedido
        if (user.products !== null && user.products !== undefined && user.products.length > 0) {
          let found = false;

          //Si tiene productos recorro el array hasta encontrar un producto igual al que se debe agregar al pedido
          for (let i = 0; i < user.products.length && !found; i++) {
            found = compareProducts(user.products[i], product);
            if (found) {
              user.products[i].quantity += product.quantity;
            }
          }

          //Si no encuentro en el pedido ningun producto igual al que se debe agregar lo agrego
          if (!found) {
            user.products.push(createProductFromProductBusiness(product))
          }
        }
        else {
          //Si el usuario no tiene productos ya agregados al pedido agrego el nuevo producto
          user.products.push(createProductFromProductBusiness(product));
        }
      })
    }
  }

  //Si el usuario no se encontro en el array de usuarios del pedido es porque es su primer pedido y 
  //debe ser agregado.
  if (!userFound) {
    let usr = {};
    let products = new Array();

    productsToAdd.forEach(prod => {
      products.push(createProductFromProductBusiness(prod));
    })

    usr.username = username;
    usr.products = products;
    usr.owner = !ownerFound;
  }

  return order.users;
}

/**Compara propiedad por propiedad para determinar si los productos dados como parámetros son iguales.
   * No compara la propiedad quantity porque esta va cambiando a medida que se agregan productos iguales al array.
   * @param prodInPreOrder producto existente en el array preOrderProducts 
   * @param product producto para el que se quiere determinar su existencia en el array preOrederProducts
   * @returns true si el producto se encuentra en el array preOrderProducts. false si no se encuentra.
   */
function compareProducts(productInUserProducts, product) {
  if (productInUserProducts.product.toString() === product.product &&
    productInUserProducts.name === product.name &&
    productInUserProducts.observations === product.observations &&
    compareProductOptions(productInUserProducts.options, product.options) &&
    productInUserProducts.price === product.price &&
    compareProductSize(productInUserProducts.size, product.size) &&
    productInUserProducts.deleted === product.deleted) {
    return true;
  }
  else {
    return false;
  }
}

/**
 * Compara los arrays de opciones dados como parametros. Si una de las opciones se encuentra en uno de los arrays pero
 * no en el otro devuelve false.
 * @param {*} productOptions1 
 * @param {*} productOptions2 
 */
function compareProductOptions(productOptions1, productOptions2) {
  //se setea la variable found en true para que entre al primer bucle
  let found = true;

  //Me fijo que todas las opciones del primer array esten en el 2. Si encuentro al menos una que no lo este
  //no sigue el bucle. La primera vez entra al bucle porque la variable found fue seteada en true. Si una opcion
  //no se encuentra en el 2do array la variable found sera false y no seguira ejecutandose este bucle.
  for (let i = 0; i < productOptions1.length && found; i++) {
    //Se setea la varialbe found en false para que entre al 2do bucle
    found = false;
    for (let j = 0; j < productOptions2.length && !found; j++) {
      found = compareOptions(productOptions1[i], productOptions2[j])
    }
  }

  return found;
}

/**
 * Compara los dos objectos de opciones dados como parametros.
 * @param {*} option1 
 * @param {*} option2 
 */
function compareOptions(option1, option2) {
  if (option1.name === option2.name &&
    option1.price === option2.price) {
    return true;
  }
  else {
    return false;
  }
}

/**
 * Compara los objectos size dados como parametros. Devuelve true si son iguales
 * @param {*} productSize1 
 * @param {*} productSize2 
 */
function compareProductSize(productSize1, productSize2) {
  if (productSize1.name === productSize2.name &&
    productSize1.price === productSize2.price) {
    return true
  }
  else {
    return false
  }
}

/**
 * Elimina el producto dado como parametro para el usuario en el pedido dado. Y actualiza el pedido en la base de datos
 * @param {*} order pedido del cual se debe eliminar el producto
 * @param {*} productToRemove producto a eliminar
 * @param {*} username usuario para el que se debe eliminar el producto
 */
async function deleteProduct(order, productToRemove, username) {
  try {
    let ord = new Order();
    let orderUpdated = new Order();

    ord._id = order._id;
    ord.users = removeProduct(order, productToRemove, username);
    ord.totalPrice = order.totalPrice;

    orderUpdated = await update(ord);

    return transformToBusinessObject(orderUpdated);
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Elimina el producto del array de productos del usuario en el pedido dado
 * @param {*} order 
 * @param {*} productToRemove 
 * @param {*} username 
 */
function removeProduct(order, productToRemove, username) {
  let userFound = false;

  for (let i = 0; i < order.users.length && !userFound; i++) {
    let user = order.users[i];
    if (user.username === username) {
      userFound = true;
      let prodFound = false;

      for (let j = 0; j < user.products.length && !prodFound; j++) {
        let product = user.products[j];
        if (product._id === productToRemove._id) {
          prodFound = true;
          order.totalPrice -= productToRemove.quantity * productToRemove.price;
          user.totalPerUser -= productToRemove.quantity * productToRemove.price;
          product.deleted = productToRemove.deleted;
          product.deletedReason = productToRemove.deletedReason;
        }
      }

      if (!prodFound) {
        throw new Error(`No se encontró el producto a eliminar en el array de productos del usuario ${username}`); 
      }
    }
  }

  return order.users;
}

/**
 * Crea un producto con el formato necesario para ser guardado en el objeto user dentro
 * del objeto order.
 * @param {*} product producto recibido desde el front end a partir del cual se quiere guardar
 *                    un producto nuevo en el pedido.
 * @returns el producto con el formato correcto para agregarse al array de productos del usuario
 */
function createProductFromProductBusiness(product) {
  let prod = {};

  prod.product = product.product;
  prod.options = product.options;
  prod.price = product.price;
  prod.size = product.size;
  prod.observations = product.observations;
  prod.quantity = product.quantity;
  prod.deleted = product.deleted;
  prod.deletedReason = product.deletedReason;

  return prod;
}

/**
 * Recupera de la base de datos los pedidos segun el estado dado como parámetro 
 * para la mesa dada como parámetro.
 * @param {Number} tableNro nro de mesa
 * @param {String} status estado del pedido a buscar
 * @returns los pedidos con estado igual al dado como parametro
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
 * @returns el pedido abierto para la mesa dada como parametro. null si no hay un pedido abierto
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
  if (order.cashRegister === null || order.cashRegister === undefined) {
    throw new Error("Se debe seleccionar una caja registradora para hacer el cierre del pedido");
  }

  let paymentFound = false;
  let ord = new Order();
  let users = new Array;
  let orderUpdated = new Order();
  users = [];

  order.users.forEach(user => {
    if (user.payments !== null && user.payments !== undefined && !paymentFound) {
      paymentFound = true;
    }

    let usr = {};
    let products = new Array;
    products = [];

    user.products.forEach(product => {
      let prod = createProductFromProductBusiness(product);

      products.push(prod);
    })

    usr.username = user.userName;
    usr.products = products;
    usr.totalPerUser = user.totalPerUser;
    usr.payments = user.payments;
    usr.owner = user.owner;

    users.push(usr);
  })

  if (!paymentFound) {
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
 * Recupera de la base de datos los pedidos segun el estado dado como parámetro 
 * para la caja registradora dada como parámetro con fecha de cierre mayor a la fecha dada.
 * @param {ObjectId} cashRegisterId 
 * @param {String} status 
 * @param {Date} completedDate 
 * @returns {Order[]} array de pedidos recuperados del backend. No se usa el tranform porque no se va a enviar al frontend
 */
async function getOrdersByCashRegisterByStatusAndCompletedDate(cashRegisterId, status, completedDate) {
  try {
    let query = { cashRegister: cashRegisterId, status: status, completed_at: { "$gte": completedDate } };
    let orders = await getOrderByQuery(query);

    return orders;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Transforma el pedido recuperado de la base de datos en el objeto pedido usado en el front end.
 * @param {*} orderEntity 
 * @returns el pedido con el formato usaro en el front end
 */
async function transformToBusinessObject(orderEntity) {
  if (orderEntity !== null && orderEntity !== undefined) {
    let order = {};
    let users = [];

    orderEntity.users.forEach(user => {
      let usr = {};
      let products = [];

      user.products.forEach(async product => {
        let prod = {};

        let productStored = await productService.getProductById(product.product);

        prod._id = product._id.toString();
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

      usr.username = user.username;
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

    order.cashRegister = (orderEntity.cashRegister !== null && orderEntity.cashRegister !== undefined) ?
      await cashRegisterService.getCashRegisterById(orderEntity.cashRegister) :
      null;

    order.waiter = (orderEntity.waiter !== null && orderEntity.waiter !== undefined) ?
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
  deleteProduct,
  updateOrder,
  closeOrder,
  getOrdersByTableByStatus,
  getOpenedOrderForTable,
  getOrdersByCashRegisterByStatusAndCompletedDate
}