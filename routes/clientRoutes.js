'use strict'

const express = require('express');
const clientCtrl = require('../controllers/client');
const clientRouter = express.Router();

clientRouter.get('/', clientCtrl.getClients);
clientRouter.get('/withCurrentAccountEnabled', clientCtrl.getWithCurrentAccountEnabled);
clientRouter.get('/:clientId', clientCtrl.getClient);
clientRouter.post('/', clientCtrl.saveClient);
clientRouter.put('/:clientId', clientCtrl.updateClient);
clientRouter.delete('/:clientId', clientCtrl.deleteClient);

module.exports = clientRouter;