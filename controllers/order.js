'use strict'

const Order = require('../models/order')

function getOrders (req, res) {
  Order.find({}, (err, orders) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!orders) return res.status(404).send({ message: `No existen órdenes registradas en la base de datos.`})

    res.status(200).send({ orders })
  })
}

function getOrder (req, res) {
  let orderId = req.params.orderId

  Order.findById(orderId, (err, order) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!order) return res.status(404).send({ message: `La orden ${orderId} no existe`})

    res.status(200).send({ order }) //Cuando la clave y el valor son iguales
  })
}

function getOrdersByUser (req, res) {
  let userId = req.params.userId

  Order.find({ 'users.id': userId }, (err, orders) => {
    if(err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})    
    if (!orders) return res.status(404).send({ message: `No existen pedidos hechos por el usuario ${userId}`})

    res.status(200).send({ orders })
  })
}

//Devuelve los pedidos abiertos o cerrados (segun query) para la mesa que se recibe como parametro
function getOrderByTableByStatus(req, res) {
  let tableNro = req.params.table
  let status = req.query.open

  Order.find({ table: tableNro, open: status }, (err, orders) => {
    if(err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})    

    res.status(200).send({ orders })
  })
}

function saveOrder (req, res) {
  let order = new Order()

  order.orderNumber = req.body.orderNumber
  order.type = req.body.type
  order.table = req.body.table
  order.waiter = req.body.waiter
  order.status = 'Open'
  order.users = req.body.users
  order.created_at = new Date()
  order.orderApp = req.body.orderApp
  //completed_at vacío hasta que se cierra el pedido (se hace en update)
  //discountPercentage idem anterior  
  //totalPrice idem anterior  

  order.save((err, orderStored) => {
    if(err){      
      return res.status(500).send({ message: `Error al guardar en la base de datos: ${err}` })
    }

    res.status(200).send({ order: orderStored })
  })
}

function updateOrder (req, res) {
  let orderId = req.params.orderId
  let bodyUpdate = req.body

  Order.findByIdAndUpdate(orderId, bodyUpdate, (err, orderUpdated) => {
    if (err) return res.status(500).send({ message: `Error al querer actualizar la orden: ${err}`})

    res.status(200).send({ order: orderUpdated })
  })
}

function deleteOrder (req, res) {
  let orderId = req.params.orderId

  Order.findById(orderId, (err, order) => {
    if (err) return res.status(500).send({ message: `Error al querer eliminar el pedido: ${err}`})

    Order.remove(err => {
      if (err) return res.status(500).send({ message: `Error al querer eliminar el pedido: ${err}`})
      res.status(200).send({message: `El pedido ha sido eliminado`})
    })
  })
}

module.exports = {
  getOrder,
  getOrdersByUser,
  getOrders,
  getOrderByTableByStatus,
  saveOrder,
  updateOrder,
  deleteOrder
}