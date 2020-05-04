'use strict'

const express = require('express');
const clientCtrl = require('../controllers/client');
const clientRouter = express.Router();
const authorize = require('../middlewares/auth/authorize');

clientRouter.get('/', authorize(), clientCtrl.getClients);
clientRouter.get('/withCurrentAccountEnabled', authorize(), clientCtrl.getWithCurrentAccountEnabled);
clientRouter.get('/:clientId', authorize(), clientCtrl.getClient);
clientRouter.get('/email/:email', authorize(), clientCtrl.getClientByEmail);
clientRouter.post('/', authorize(), clientCtrl.saveClient);
clientRouter.put('/:clientId', authorize(), clientCtrl.updateClient);
clientRouter.delete('/:clientId', authorize(), clientCtrl.deleteClient);

module.exports = clientRouter;