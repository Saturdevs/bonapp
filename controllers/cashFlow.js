'use strict'

const CashFlow = require('../models/cashFlow')

function getCashFlows (req, res) {
  CashFlow.find({}, (err, cashFlows) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!cashFlows) return res.status(404).send({ message: `No existen movimientos registrados en la base de datos.`})

    res.status(200).send({ cashFlows })
  })
}

function getCashFlow (req, res) {
  let cashFlowId = req.params.cashFlowId

  CashFlow.findById(cashFlowId, (err, cashFlow) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!cashFlow) return res.status(404).send({ message: `El movimiento ${cashFlowId} no existe`})

    res.status(200).send({ cashFlow })
  })
}

function getCashFlowByCashRegister (req, res) {
  let cashRegisterId = req.params.cashRegisterId

  CashFlow.find({cashRegisterId: cashRegisterId}, (err, cashFlows) => {
      if(err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})    
      if (!cashFlows) return res.status(404).send({ message: `No existen movimientos para la caja ${cashRegisterId}`})

      res.status(200).send({ cashFlows })
  })
}

function saveCashFlow (req, res) {
  console.log('POST /api/cashFlow')
  console.log(req.body)

  let cashFlow = new CashFlow()
  cashFlow.cashRegisterId = req.body.cashRegisterId
  cashFlow.date = new Date();
  //cashFlow.createdBy = req.body.user
  cashFlow.totalAmount = req.body.totalAmount
  cashFlow.type = req.body.type
  cashFlow.paymentType = req.body.paymentType
  cashFlow.comment = req.body.comment
  cashFlow.deleted = false

  cashFlow.save((err, cashFlowStored) => {
    if(err){
      return res.status(500).send({ message: `Error al querer guardar el movimiento: ${err}.` })
    }

    res.status(200).send({ cashFlow: cashFlowStored })
  })
}

function updateCashFlow (req, res) {
  let cashFlowId = req.params.cashFlowId
  let bodyUpdate = req.body

  CashFlow.findByIdAndUpdate(cashFlowId, bodyUpdate, (err, cashFlowUpdated) => {
    if(err){
      return res.status(500).send({ message: `Error al querer actualizar el movimiento: ${err}.` })
    }

    res.status(200).send({ cashFlow: cashFlowUpdated })
  })
}

function deleteCashFlow (req, res) {
  let cashFlowId = req.params.cashFlowId

  CashFlow.findById(cashFlowId, (err, cashFlow) => {
    if (err) return res.status(500).send({ message: `Error al querer borrar el movimiento: ${err}`})

    cashFlow.remove(err => {
      if (err) return res.status(500).send({ message: `Error al querer borrar el movimiento: ${err}`})
      res.status(200).send({message: `El movimiento ha sido eliminado`})
    })
  })
}

module.exports = {
  getCashFlow,  
  getCashFlows,
  getCashFlowByCashRegister,
  saveCashFlow,
  updateCashFlow,
  deleteCashFlow
}