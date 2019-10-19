'use strict'

const Order = require('../models/order');
const OrderService = require('../services/order');
const orderStatus = require('../shared/enums/orderStatus');

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

//Devuelve los pedidos abiertos o cerrados (segun query) para la mesa que se recibe como parametro
async function getOrderByTableByStatus(req, res) {
  let tableNro = parseInt(req.params.table);
  let status = req.query.open;
  let data = {};

  try {
    if (status === orderStatus.OPEN) {
      data = await OrderService.getOpenedOrderForTable(tableNro);
    }
    else {
      data = await OrderService.getOrdersByTableByStatus(tableNro, status);
    }

    res.status(200).send({ order: data });
  }
  catch (err) {
    throw new Error(err);
  }
}

async function saveOrder(req, res) {
  try {
    const orderDTO = req.body;

    let order = await OrderService.createOrder(orderDTO);
 
    if (order !== null && order !== 'undefined')
    {
      res.status(200).send({ order: order });
    }
    else 
    {
      res.status(500).send({ message: `Error al guardar en la base de datos` });  
    }
  }
  catch (err) {
    res.status(500).send({ message: `Error al guardar en la base de datos: ${err}` });
  }
}

async function updateOrderProducts(req, res) {
  try {
    let orderDTO = req.body.order;
    let userName = req.body.username;
    let productsToAdd = req.body.products;
    let totalToAdd = req.body.total;

    const orderUpdated = await OrderService.updateOrderProducts(orderDTO, productsToAdd, userName, totalToAdd);

    if (orderUpdated !== null && orderUpdated !== undefined)
    {
      res.status(200).send({ order: orderUpdated });
    }
    else 
    {
      res.status(500).send({ message: `Error al actualizar los productos del pedido en la base de datos` });  
    }
  }
  catch (err) {
    res.status(500).send({ message: `Error al actualizar los productos del pedido en la base de datos: ${err}` });
  }
}

async function deleteProductOrder(req, res) {
  try {
    let orderDTO = req.body.order;
    let userName = req.body.username;
    let productToRemove = req.body.productToRemove;

    const orderUpdated = await OrderService.deleteProduct(orderDTO, productToRemove, userName);

    if (orderUpdated !== null && orderUpdated !== undefined)
    {
      res.status(200).send({ order: orderUpdated });
    }
    else 
    {
      res.status(500).send({ message: `Error al eliminar el producto del pedido en la base de datos` });  
    }
  }
  catch (err) {
    res.status(500).send({ message: `Error al eliminar el producto del pedido en la base de datos: ${err}` });
  }
}

async function updateOrder(req, res) {
  try {
    let orderDTO = req.body;

    const orderUpdated = await OrderService.updateOrder(orderDTO);

    if (orderUpdated !== null && orderUpdated !== 'undefined')
    {
      res.status(200).send({ order: orderUpdated });
    }
    else 
    {
      res.status(500).send({ message: `Error al querer actualizar la orden: orderUpdated es null o undefined` });  
    }
  }
  catch (err) {
    res.status(500).send({ message: `Error al querer actualizar la orden: ${err}` });  
  }
}

async function closeOrder(req, res) {
  try {
    let orderDTO = req.body;

    const orderUpdated = await OrderService.closeOrder(orderDTO);

    if (orderUpdated !== null && orderUpdated !== 'undefined')
    {
      res.status(200).send({ order: orderUpdated });
    }
    else 
    {
      res.status(500).send({ message: `Error al querer cerrar el pedido: orderUpdated es null o undefined` });  
    }
  }
  catch (err) {
    res.status(500).send({ message: `Error al querer cerrar el pedido: ${err}` });  
  }
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
  getOrders,
  getOrderByTableByStatus,
  saveOrder,
  updateOrderProducts,
  deleteProductOrder,
  updateOrder,
  closeOrder,
  deleteOrder,
  unSetTable
}