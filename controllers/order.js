'use strict'

const Order = require('../models/order')

function getOrders(req, res) {
  Order.find({}, (err, orders) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}` })
    if (!orders) return res.status(404).send({ message: `No existen órdenes registradas en la base de datos.` })

    res.status(200).send({ orders })
  })
}

function getOrder(req, res) {
  let orderId = req.params.orderId

  Order.findById(orderId)
    .populate('cashRegister')
    .exec((err, order) => {
      if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}` })
      if (!order) return res.status(404).send({ message: `La orden ${orderId} no existe` })

      res.status(200).send({ order }) //Cuando la clave y el valor son iguales
    })
}

function getOrdersByUser(req, res) {
  let userId = req.params.userId

  Order.find({ 'users.id': userId }, (err, orders) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}` })
    if (!orders) return res.status(404).send({ message: `No existen pedidos hechos por el usuario ${userId}` })

    res.status(200).send({ orders })
  })
}

//Devuelve los pedidos abiertos o cerrados (segun query) para la mesa que se recibe como parametro
function getOrderByTableByStatus(req, res) {
  let tableNro = parseInt(req.params.table)
  let status = req.query.open

  Order.find({ table: tableNro, status: status })
    .populate('users.user')
    .populate('users.products.product')
    .populate('waiter')
    .populate('cashRegister')
    .exec((err, orders) => {
      if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}` })

      res.status(200).send({ orders })
    })
}

function getLastOrder() {
  return Order.find().sort({ orderNumber: -1 }).limit(1).exec();
}

async function saveOrder(req, res) {
  let order = new Order()

  order.type = req.body.type
  order.table = req.body.table
  order.waiter = req.body.waiter
  order.status = 'Open'
  order.users = req.body.users
  order.app = req.body.app
  order.created_at = new Date()
  //completed_at vacío hasta que se cierra el pedido (se hace en update)
  //discountPercentage idem anterior  
  //totalPrice idem anterior  

  try {
    let orderedOrders = await getLastOrder();
    let lastOrder = orderedOrders [0];

    if (lastOrder === null || lastOrder === undefined) {
      order.orderNumber = 1;
    }
    else {
      order.orderNumber = lastOrder.orderNumber +1;
    }
  }
  catch (err) {
    return res.status(500).send({ message: `Error al guardar en la base de datos: ${err}` })
  }
  
  order.save((err, orderStored) => {
    if (err) {
      return res.status(500).send({ message: `Error al guardar en la base de datos: ${err}` })
    }

    res.status(200).send({ order: orderStored })
  })
}

function updateOrder(req, res) {
  let orderId = req.params.orderId
  let bodyUpdate = req.body

  Order.findByIdAndUpdate(orderId, bodyUpdate, { new: true }, (err, orderUpdated) => {
    if (err) return res.status(500).send({ message: `Error al querer actualizar la orden: ${err}` })

    res.status(200).send({ order: orderUpdated })
  })
}

function deleteOrder(req, res) {
  let orderId = req.params.orderId

  Order.findById(orderId, (err, order) => {
    if (err) return res.status(500).send({ message: `Error al querer eliminar el pedido: ${err}` })

    Order.remove(err => {
      if (err) return res.status(500).send({ message: `Error al querer eliminar el pedido: ${err}` })
      res.status(200).send({ message: `El pedido ha sido eliminado` })
    })
  })
}

function unSetTable(req, res) {
  let tableNumber = req.params.tableNumber
  Order.updateMany({ table: tableNumber }, { $set: { table: null } }, (err, raw) => {
    if (err) return res.status(500).send({ message: `Error al eliminar la mesa del pedido: ${err}` });
    res.status(200).send({ message: `Todos los pedidos con número de mesa ${tableNumber} han quedado sin una mesa asignada` })
  });
}

module.exports = {
  getOrder,
  getOrdersByUser,
  getOrders,
  getOrderByTableByStatus,
  saveOrder,
  updateOrder,
  deleteOrder,
  unSetTable
}