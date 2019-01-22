'use strict'

const Client = require('../models/client')

function getClients (req, res) {
  Client.find({}, null, {sort: {name: 1}}, (err, clients) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!clients) return res.status(404).send({ message: `No existen clientes registrados en la base de datos.`})

    res.status(200).send({ clients })
  })
}

function getClient (req, res) {
  let clientId = req.params.clientId

  Client.findById(clientId, (err, client) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!client) return res.status(404).send({ message: `El cliente ${clientId} no existe`})

    res.status(200).send({ client })
  })
}

function getClientsWithTransactions (req, res) {
  Client.find({}, null, {sort: {name: 1}}, (err, clients) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!clients) return res.status(404).send({ message: `No existen clientes registrados en la base de datos.`})

    let clientsWithTransactions = new Array()
    clients.map(client => {
      if (client.transactions.length > 0) {
        clientsWithTransactions.push(client)
      }
    })

    res.status(200).send({ clients: clientsWithTransactions })
  })
}

function getTransactions (req, res) {
  Client.find({}, (err, clients) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!clients) return res.status(404).send({ message: `No existen clientes registrados en la base de datos.`})

    let transactions = new Array()
    clients.forEach(client => {
      client.transactions.forEach(transaction => {
        transactions.push({ 
          _id: transaction._id,
          clientId: client._id,
          clientName: client.name, 
          date: transaction.date, 
          amount: transaction.amount,
          balance: transaction.balance, 
          deleted: transaction.deleted 
        })   
      })
    })

    res.status(200).send({ transactions })
  })  
}

function getTransactionByClientById (req, res) {
  let clientId = req.params.clientId
  let transactionId = req.params.transactionId

  Client.findById(clientId, (err, client) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!client) return res.status(404).send({ message: `El cliente ${clientId} no existe`})

    let transact = {}    
    client.transactions.forEach(transaction => {      
      if (String(transaction._id) === transactionId) {
        transact = {          
          _id: transaction._id,
          clientId: client._id,
          clientName: client.name, 
          paymentMethod: transaction.paymentMethod,
          cashRegister: transaction.cashRegister,
          date: transaction.date, 
          amount: transaction.amount,
          comment: transaction.comment, 
          deleted: transaction.deleted 
        }                
      }
    })

    res.status(200).send({ transaction: transact })
  })
}

function getTransactionsByClient (req, res) {
  let clientId = req.params.clientId

  Client.findById(clientId, (err, client) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!client) return res.status(404).send({ message: `El cliente ${clientId} no existe`})

    let transactions = new Array()
    client.transactions.forEach(transaction => {
      transactions.push({ 
        _id: transaction._id,
        clientId: client._id,
        clientName: client.name, 
        date: transaction.date, 
        amount: transaction.amount,
        balance: transaction.balance, 
        deleted: transaction.deleted 
      })      
    });

    res.status(200).send({ transactions })
  })
}

function saveClient (req, res) {
  console.log('POST /api/client')
  console.log(req.body)

  let client = new Client()
  client.name = req.body.name
  client.tel = req.body.tel || null
  client.addressStreet = req.body.addressStreet || null
  client.addressNumber = req.body.addressNumber || null
  client.addressDpto = req.body.addressDpto || null
  client.enabledTransactions = req.body.enabledTransactions
  client.balance = 0

  client.save((err, clientStored) => {
    if(err){
      if(err['code'] == 11000) 
        return res.status(500).send({ message: `${err}.` })
      return res.status(500).send({ message: `Error al guardar en la base de datos: ${err}` });
    }

    res.status(200).send({ client: clientStored })
  })
}

function updateClient (req, res) {
  let clientId = req.params.clientId
  let bodyUpdate = req.body

  Client.findByIdAndUpdate(clientId, bodyUpdate, (err, clientUpdated) => {
    if(err){
      if(err['code'] == 11000) 
        return res.status(500).send({ message: `Ya existe un cliente con ese teléfono. Ingrese otro teléfono.` })
      return res.status(500).send({ message: `Error al guardar en la base de datos: ${err}` });
    }

    res.status(200).send({ client: clientUpdated })
  })
}

function deleteClient (req, res) {
  let clientId = req.params.clientId

  Client.findById(clientId, (err, client) => {
    if (err) return res.status(500).send({ message: `Error al querer borrar el cliente: ${err}`})

    client.remove(err => {
      if (err) return res.status(500).send({ message: `Error al querer borrar el cliente: ${err}`})
      res.status(200).send({message: `El cliente ha sido eliminado`})
    })
  })
}

module.exports = {
  getClient,  
  getClients,
  getClientsWithTransactions,
  getTransactions,
  getTransactionByClientById,
  getTransactionsByClient,
  saveClient,
  updateClient,
  deleteClient
}