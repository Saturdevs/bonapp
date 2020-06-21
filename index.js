'use strict'

const mongoose = require('mongoose')
const app = require('./app')
const config = require('./config')
const socketIo = require('./services/socket-io')
const scheduler = require('./services/scheduler')
const webpush = require('web-push')

mongoose.connect(config.db, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
  if (err) {
    return console.log(`Error al conectar a la base de datos: ${err}`)
  }
  console.log('Conexión a la base de datos establecida...')

  var server = app.listen(config.port, () => {
    console.log(`API REST corriendo en http://localhost:${config.port}`)
  })

  socketIo.initialize(server);
  scheduler.runScheduler();
})