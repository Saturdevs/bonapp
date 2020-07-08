'use strict'
const mongoose = require('mongoose');
const Order = require('../models/order');
const TableService = require('../services/table');
const TableStatus = require('../shared/enums/tableStatus');
const OrderStatus = require('../shared/enums/orderStatus');
const CashRegisterDAO = require('../dataAccess/cashRegister');
const OrderDAO = require('../dataAccess/order');
const ProductDAO = require('../dataAccess/product');
const UserDAO = require('../dataAccess/user');
const DailyMenuDAO = require('../dataAccess/dailyMenu');
const ProductPaymentStatus = require('../shared/enums/productPaymentStauts');
const PaymentTypeService = require('../services/paymentType');

/**
 * @description Recupera un único order con cashRegisterId igual al dado como parametro. Si hay mas de uno
 * devuelve el primero que encuentra.
 * @param {string} cashRegisterId 
 * @returns primer pedido encontrado con cashRegisterId igual al dado como parametro.
 */
async function retrieveOneOrderForCashRegister(cashRegisterId) {
  try {
    let query = { cashRegister: cashRegisterId };
    let order = await OrderDAO.getOneOrderByQuery(query);

    return order;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Crea y guarda en la base de datos un pedido nuevo a partir del objeto recibido 
 * desde el front-end.
 * @param {*} order pedido a crear recibido desde el front end
 */
async function createOrder(order) {
  // const session = await mongoose.startSession();
  const collection = await mongoose.connection.db.listCollections({ name: "orders" }).toArray();
  if (collection === null || collection === undefined || collection.length === 0) {
    await Order.createCollection();
  }
  // session.startTransaction();
  try {
    const opts = { /*session: session, new: true*/ };

    let table = await TableService.updateTableByNumber(order.table, { status: TableStatus.OCUPADA }, opts);
    let newOrder = new Order();
    let lastOrder = await OrderDAO.getLastOrder();

    if (lastOrder === null || lastOrder === undefined) {
      newOrder.orderNumber = 1;
    }
    else {
      newOrder.orderNumber = lastOrder.orderNumber + 1;
    }

    newOrder.type = order.type;
    newOrder.table = order.table;
    newOrder.waiter = order.waiter;
    newOrder.status = OrderStatus.OPEN;
    newOrder.users = order.users;
    newOrder.app = order.app;
    newOrder.created_at = new Date();

    const orderSaved = await newOrder.save(opts);

    // await session.commitTransaction();
    // session.endSession();
    return transformToBusinessObject(orderSaved);
  }
  catch (err) {
    // await session.abortTransaction();
    // session.endSession();
    throw new Error(err);
  }
}

/**
 * Hace el update del pedido cuando se agregan productos.
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
    //Todos los productos deben ser agregados al pedido con paymentStatus PENDING
    //para saber que todavia no se pagaron.
    productsToAdd.forEach(prod => {
      prod.paymentStatus = ProductPaymentStatus.PENDING;
    })
    ord.users = updateProducts(order, productsToAdd, username, totalToAdd);
    if (order.totalPrice === null || order.totalPrice === undefined) {
      order.totalPrice = 0;
    }

    ord.totalPrice = order.totalPrice + totalToAdd;

    orderUpdated = await OrderDAO.update(ord);

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

    order.users.push(usr);
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
  if ((productInUserProducts.product !== undefined && productInUserProducts.product !== null && productInUserProducts.product.toString() === product.product &&
    productInUserProducts.name === product.name &&
    productInUserProducts.observations === product.observations &&
    compareProductOptions(productInUserProducts.options, product.options) &&
    productInUserProducts.price === product.price &&
    compareProductSize(productInUserProducts.size, product.size) &&
    productInUserProducts.deleted === product.deleted &&
    productInUserProducts.paymentStatus === product.paymentStatus) ||
    (productInUserProducts.dailyMenuId !== undefined && productInUserProducts.dailyMenuId !== null && productInUserProducts.dailyMenuId.toString() === product.dailyMenuId &&
      productInUserProducts.name === product.name &&
      productInUserProducts.observations === product.observations &&
      productInUserProducts.price === product.price &&
      productInUserProducts.deleted === product.deleted &&
      productInUserProducts.paymentStatus === product.paymentStatus)) {
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

  if ((productOptions1 === null || productOptions1 === undefined) &&
    (productOptions2 === null || productOptions2 === undefined)) {
    return true;
  } else if (productOptions1 === null || productOptions1 === undefined) {
    return false;
  } else if (productOptions2 === null || productOptions2 === undefined) {
    return false;
  } else {

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
  if ((productSize1 === null || productSize1 === undefined) &&
    (productSize2 === null || productSize2 === undefined)) {
    return true;
  } else if (productSize1 === null || productSize1 === undefined) {
    return false;
  } else if (productSize2 === null || productSize2 === undefined) {
    return false;
  } else {
    if (productSize1.name === productSize2.name &&
      productSize1.price === productSize2.price) {
      return true
    }
    else {
      return false
    }
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

    orderUpdated = await OrderDAO.update(ord);

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

  prod._id = product._id;
  prod.employeeWhoAdded = product.employeeWhoAdded;
  prod.employee = product.employee;
  prod.dailyMenuId = product.dailyMenuId;
  prod.product = product.product;
  prod.options = product.options;
  prod.price = product.price;
  prod.size = product.size;
  prod.observations = product.observations;
  prod.quantity = product.quantity;
  prod.deleted = product.deleted;
  prod.deletedReason = product.deletedReason;    
  prod.paymentStatus = product.paymentStatus;

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
    let orders = await OrderDAO.getOrderByQuery(query);

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
    let query = { table: tableNro, status: OrderStatus.OPEN };
    let order = await OrderDAO.getOrderByQuery(query);

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
    let orderUpdated = await OrderDAO.update(order);

    return transformToBusinessObject(orderUpdated);
  }
  catch (err) {
    throw new Error(err);
  }
}

/**@description Realiza las validaciones correspondientes al pago y luego
 *  actualiza o cierra la orden segun dorresponda 
 * @param {*} order pedido sobre el que se deben actualizar los pagos de los usuarios.
 * @param {boolean} unblockUsers
 * @param users usuarios para los que se esta realizando el pago.
 */
async function updateOrderPayments(order, unblockUsers, users) {
  try {
    let totalPayed = 0;
    let orderUpdated = null;

    for (let i = 0; i < users.length; i++) {
      let user = users[i];
      let totalPerUser = 0;
      user.payments.forEach(payment => {
        totalPerUser += payment.amount
      });

      if (totalPerUser > user.totalPerUser) {
        let found = false;
        let cashPaymentIndex = null;
        //Busco el tipo de pago efectivo para descontarle la diferencia.
        for (let j = 0; j < user.payments.length && !found; j++) {
          const payment = user.payments[j];
          const paymentDb = await PaymentTypeService.getPaymentType(payment.methodId);
          if (paymentDb.cash) {
            cashPaymentIndex = j;
            found = true;
          }
        }

        //Si el tipo de pago efectivo se encuentra en el array de payments del usuario le descuento la diferencia.
        //Sino devuelvo error. (solo debería ser cuando se paga desde el sistema web, en la app no hay pago en efectivo - 06/07/20)
        if (cashPaymentIndex !== null) {
          let orderTotalPayed = 0;
          for (let k = 0; k < order.users.length; k++) {
            const usr = order.users[k];
            if (usr.username !== user.username) {
              usr.payments.forEach(payment => {
                orderTotalPayed += payment.amount
              });
            }
          }
          for (let l = 0; l < user.payments.length; l++) {
            const payment = user.payments[l];
            orderTotalPayed += payment.amount;
          }

          //Si el total del pago de los usuarios para los que se esta actualizando el pago mas lo ya pagado por otros usuarios
          //en el objeto order es mayo que el precio total del pedido calculo el monto real (monto ingrasado menos el vuelto)
          //Sino devuelvo error.
          if (orderTotalPayed > order.totalPrice) {
            user.payments[cashPaymentIndex].amount -= (orderTotalPayed - order.totalPrice);
          } else {
            throw new Error(`El monto ingresado no es suficiente para pagar el total del pedido y no se permiten pagos parciales. Por favor, revise los montos y vuelva a intentar.`);
          }
        } else {
          throw new Error(`La suma de los pagos es mayor al total para el usuario ${user.username} y el pago no es en efectivo por lo que no se le puede dar vuelto. Ingrese el monto exacto`);
        }
      }

      if (unblockUsers) {
        user.blocked = false;
      }

      //Si llego hasta aca es porque el pago es valido. Busco el usuario en el pedido y actualizo los pagos y los productos.
      const userInOrder = order.users.find(usr => usr.username === user.username);
      if (userInOrder) {
        userInOrder.payments = user.payments;
        userInOrder.products.forEach(prod => {
          prod.paymentStatus = ProductPaymentStatus.PAYED;
        })
      }
    }

    for (let i = 0; i < order.users.length; i++) {
      const user = order.users[i];
      user.payments.forEach(payment => {
        totalPayed += payment.amount
      });
    }

    if (totalPayed >= order.totalPrice) {
      orderUpdated = await closeOrder(order);
    } else {
      orderUpdated = await updateOrder(order);
    }

    return orderUpdated
  }
  catch (err) {
    throw new Error(err.message);
  }
}

async function closeOrder(order) {
  // const session = await mongoose.startSession();
  const collection = await mongoose.connection.db.listCollections({ name: "orders" }).toArray();
  if (collection === null || collection === undefined || collection.length === 0) {
    await Order.createCollection();
  }
  // session.startTransaction();
  try {
    const opts = { /*session: session, new: true*/ };

    let table = await TableService.updateTableByNumber(order.table, { status: TableStatus.LIBRE }, opts);
    if (order.cashRegister === null || order.cashRegister === undefined) {
      throw new Error("Se debe seleccionar una caja registradora para hacer el cierre del pedido");
    }

    let paymentFound = false;
    let ord = new Order();
    let users = new Array();
    let orderUpdated = new Order();
    users = [];

    order.users.forEach(user => {
      if (user.payments !== null && user.payments !== undefined && !paymentFound) {
        paymentFound = true;
      }

      let usr = {};
      let products = new Array();
      products = [];

      user.products.forEach(product => {
        let prod = createProductFromProductBusiness(product);

        products.push(prod);
      })

      usr._id = user._id;
      usr.username = user.username;
      usr.socketId = user.socketId ? user.socketId : null;
      usr.products = products;
      usr.blocked = user.blocked ? user.blocked : null; 
      usr.totalPerUser = user.totalPerUser;
      usr.payments = user.payments;
      usr.owner = user.owner;
      usr.clientId = user.clientId ? user.clientId : null;  

      users.push(usr);
    })

    if (!paymentFound) {
      throw new Error("Se debe seleccionar al menos un tipo de pago para hacer el cierre del pedido");
    }

    ord._id = order._id;
    ord.cashRegister = order.cashRegister._id;
    ord.status = OrderStatus.CLOSED;
    ord.users = users;
    ord.completed_at = new Date();
    ord.discount = order.discount;
    ord.totalPrice = order.totalPrice;

    orderUpdated = await OrderDAO.update(ord);

    return transformToBusinessObject(orderUpdated);
  }
  catch (err) {
    // await session.abortTransaction();
    // session.endSession();
    throw new Error(err);
  }
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
    let orders = await OrderDAO.getOrderByQuery(query);

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

    for (let i = 0; i < orderEntity.users.length; i++) {
      const user = orderEntity.users[i];
      let usr = {};
      let products = [];

      for (let j = 0; j < user.products.length; j++) {
        const product = user.products[j];
        let prod = {};

        if (product.product !== null && product.product !== undefined) {
          const productStored = await ProductDAO.getProductById(product.product);

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
          prod.paymentStatus = product.paymentStatus;
          prod.employeeWhoAdded = product.employeeWhoAdded;
          prod.employee = product.employee;
        }

        if (product.dailyMenuId !== null && product.dailyMenuId !== undefined) {
          const dailyMenuStored = await DailyMenuDAO.getDailyMenuById(product.dailyMenuId);

          prod._id = product._id.toString();
          prod.product = null;
          prod.dailyMenuId = dailyMenuStored._id.toString();
          prod.name = dailyMenuStored.name;
          prod.options = null;
          prod.price = dailyMenuStored.price;
          prod.size = null;
          prod.observations = product.observations;
          prod.quantity = product.quantity;
          prod.deleted = product.deleted;
          prod.deletedReason = product.deletedReason;
          prod.paymentStatus = product.paymentStatus;
          prod.employeeWhoAdded = product.employeeWhoAdded;
          prod.employee = product.employee;
        }


        products.push(prod);
      }

      usr._id = user._id;
      usr.username = user.username;
      usr.products = products;
      usr.totalPerUser = user.totalPerUser;
      usr.payments = user.payments;
      usr.owner = user.owner;
      usr.blocked = user.blocked;
      usr.clientId = user.clientId;

      users.push(usr);
    }

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
      await CashRegisterDAO.getCashRegisterById(orderEntity.cashRegister) :
      null;

    order.waiter = (orderEntity.waiter !== null && orderEntity.waiter !== undefined) ?
      await UserDAO.getUserById(orderEntity.waiter) :
      null;

    return order;
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
  updateOrderPayments,
  getOrdersByCashRegisterByStatusAndCompletedDate,
  retrieveOneOrderForCashRegister
}