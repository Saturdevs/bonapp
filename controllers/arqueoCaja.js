'use strict'

/**
 * @module Cash Counts
 */

const Arqueo = require('../models/arqueoCaja')
const Order = require('../models/order')
const CashFlow = require('../models/cashFlow')
const Client = require('../models/client')
const HttpStatus = require('http-status-codes')

/** 
 * @method
 * @description Devuelve todos los arqueos, tanto los eliminados como los no eliminados.
 * @return {json} arqueos
 */
function getAll (req, res) {
  Arqueo.find({}, (err, arqueos) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!arqueos) return res.status(404).send({ message: `No existen arqueos registrados en la base de datos.`})

    res.status(200).send({ arqueos })
  })
}

/** 
 * @method
 * @description Devuelve todos los arqueos habilitados.
 * @return {json} arqueos
 */
function getArqueos (req, res) {
  Arqueo.find({ deleted: false }, (err, arqueos) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!arqueos) return res.status(404).send({ message: `No existen arqueos registrados en la base de datos.`})

    res.status(200).send({ arqueos })
  })
}

/** 
 * @method
 * @description Devuelve el arqueo correspondiente al id seleccionado.
 * @param req.params.arqueoId {objectID} Es el id del arqueo a buscar.
 * @return {json} arqueo
 */
function getArqueo (req, res) {
  let arqueoId = req.params.arqueoId

  Arqueo.findById(arqueoId, (err, arqueo) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!arqueo) return res.status(404).send({ message: `El arqueo ${arqueoId} no existe`})

    res.status(200).send({ arqueo })
  })
}

/** 
 * @method
 * @description Devuelve los arqueos correspondientes a una caja registradora.
 * @param req.params.cashRegisterId {objectID} Es el id de la caja registradora.
 * @return {json} arqueos
 */
function getArqueosByCashRegister (req, res) {
  let cashRegisterId = req.params.cashRegisterId

  Arqueo.find({cashRegisterId: cashRegisterId, deleted: false}, (err, arqueos) => {
      if(err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})    
      if (!arqueos) return res.status(404).send({ message: `No existen arqueos para la caja ${cashRegisterId}`})

      res.status(200).send({ arqueos })
  })
}

/** 
 * @method
 * @description Devuelve el último arqueo correspondiente a una caja registradora.
 * @param req.params.cashRegisterId {objectID} Es el id de la caja registradora.
 * @return {json} arqueo
 */
function getLastArqueoByCashRegister (req, res) {
  let cashRegisterId = req.params.cashRegisterId
  
  Arqueo.find({cashRegisterId: cashRegisterId, deleted: false}, {closedAt: 1}, (err, arqueos) => {
      if(err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})    
      if (!arqueos) return res.status(404).send({ message: `No existen arqueos para la caja ${cashRegisterId}`})

      res.status(200).send({ lastArqueo: arqueos[0] })
  }).sort({ closedAt: -1 }) 
}

/** 
 * @method
 * @description Devuelve el arqueo que se encuentra abierto correspondiente a la caja registradora enviada como parámetro.
 * @param req.params.cashRegisterId {objectID} Es el id de la caja registradora.
 * @return {json} json
 */
function getArqueoOpenByCashRegister (req, res) {
  let cashRegisterId = req.params.cashRegisterId

  Arqueo.findOne({cashRegisterId: cashRegisterId, closedAt: null, deleted: false }, (err, arqueo) => {
    if(err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})

    res.status(200).send({ arqueo })
  })
}

/** 
 * @method
 * @description Setea los movimientos de la caja registradora para la cual se creó el nuevo arqueo realizados 
 *              después de la fecha de apertura del arqueo.
 * @param arqueo Nuevo arqueo 
 */
async function setCashMovementsByDateToCashCount (arqueo) {
  let result = {};
  let ingresos = new Array();
  let egresos = new Array();
  let cashRegisterId = arqueo.cashRegisterId;
  let date = arqueo.createdAt;
  let error;

  await Order.find({cashRegister: cashRegisterId, status: 'Closed', completed_at: {"$gte" : date}}, (err, orders) => {
    if (err) error = true;

    if (orders) {
      orders.forEach(order => {
        order.users.forEach(orderUser => {
          orderUser.payments.forEach(payment => {
            if (payment !== null && payment !== 'undefined')
            {
              ingresos.push({
                paymentType: payment.methodId, 
                desc: 'Ventas',
                amount: payment.amount
              })
            }
          })          
        })
      })
    }
  })

  await CashFlow.find({cashRegisterId: cashRegisterId, deleted: false, date: {"$gte" : date}}, (err, cashFlows) => {
    if (err) error = true;

    if (cashFlows) {
      cashFlows.forEach(cashFlow => {
        if (cashFlow.type === 'Ingreso') {
          ingresos.push({
            paymentType: cashFlow.paymentType, 
            desc: 'Movimiento de Caja',
            amount: cashFlow.totalAmount
          })
        } else if (cashFlow.type === 'Egreso') {
          egresos.push({
            paymentType: cashFlow.paymentType, 
            desc: 'Movimiento de Caja',
            amount: cashFlow.amount
          })
        }
      })
    }
  })

  await Client.find({transactions: { $exists: true, $not: {$size: 0}}}, (err, clients) => {
    if (err) error = true;

    if (clients) {
      clients.forEach(client => {
        if (client.transactions.length > 0) {
          client.transactions.forEach(transaction => {
            if (transaction.date > date) {
              ingresos.push({
                paymentType: transaction.paymentMethod, 
                desc: 'Cobros clientes cta. cte',
                amount: transaction.amount
              })
            }
          })
        }
      })
    }
  })
  
  if (error) {
    result = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `Error al realizar la búsqueda de movimientos de caja posteriores al arqueo al servidor ${err}`
    }
    return result
  } else {
    arqueo.ingresos = ingresos
    arqueo.egresos = egresos
    result = {
      status: HttpStatus.OK,
      message: `Se ha guardado el arqueo`
    }

    return result
  }  
}

/** 
 * @method
 * @description Inserta un arqueo nuevo en la base de datos.
 * @param req.body Arqueo a insertar.
 * @return {json} arqueo: arqueoStored
 */
async function saveArqueo (req, res) {
  console.log('POST /api/arqueo')
  console.log(req.body)

  let arqueo = new Arqueo()
  arqueo.cashRegisterId = req.body.cashRegisterId
  arqueo.createdAt = req.body.createdAt;
  //arqueo.createdBy = req.body.user
  arqueo.initialAmount = req.body.initialAmount
  arqueo.ingresos = req.body.ingresos
  arqueo.egresos = req.body.egresos
  arqueo.comment = req.body.comment
  arqueo.deleted = false

  let result = await setCashMovementsByDateToCashCount(arqueo);

  if (result.status === HttpStatus.OK) {
    arqueo.save((err, arqueoStored) => {
      if(err){
        return res.status(500).send({ message: `Error al querer guardar el arqueo: ${err}.` })
      }

      res.status(200).send({ arqueo: arqueoStored })
    })
  }
  else {
    res.status(result.status).send({message: result.message})
  }
}

/** 
 * @method
 * @description Actualiza el arqueo en la base de datos correspondiente al id enviado como parámetro.
 * @param req.params.arqueoId Es el id del arqueo a actualizar.
 * @param req.body Es el arqueo a actualizar.
 * @return {json} arqueo: arqueoUpdated
 */
function updateArqueo (req, res) {
  let arqueoId = req.params.arqueoId
  let bodyUpdate = req.body

  Arqueo.findByIdAndUpdate(arqueoId, bodyUpdate, (err, arqueoUpdated) => {
    if(err){
      return res.status(500).send({ message: `Error al querer actualizar el arqueo: ${err}.` })
    }

    res.status(200).send({ arqueo: arqueoUpdated })
  })
}

/** 
 * @method
 * @description Elimina el arqueo de la base de datos correspondiente al id enviado como parámetro.
 * @param req.params.arqueoId Es el id del arqueo a eliminar.
 */
function deleteArqueo (req, res) {
  let arqueoId = req.params.arqueoId

  Arqueo.findById(arqueoId, (err, arqueo) => {
    if (err) return res.status(500).send({ message: `Error al querer borrar el arqueo: ${err}`})

    arqueo.remove(err => {
      if (err) return res.status(500).send({ message: `Error al querer borrar el arqueo: ${err}`})
      res.status(200).send({message: `El arqueo ha sido eliminado`})
    })
  })
}

module.exports = {
  getAll,
  getArqueo,  
  getArqueos,
  getArqueosByCashRegister,
  getArqueoOpenByCashRegister,
  getLastArqueoByCashRegister,
  saveArqueo,
  updateArqueo,
  deleteArqueo
}