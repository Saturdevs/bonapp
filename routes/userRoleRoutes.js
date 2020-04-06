'use strict'

const express = require('express');
const userRoleCtrl = require('../controllers/userRole');
const userRoleRouter = express.Router();

userRoleRouter.get('/', userRoleCtrl.getAllUserRoles);
userRoleRouter.get('/withoutrights', userRoleCtrl.getAllUserRolesWithoutRights);
userRoleRouter.get('/:userRoleId', userRoleCtrl.getUserRole);

module.exports = userRoleRouter;