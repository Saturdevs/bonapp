'use strict'

const express = require('express');
const userRoleCtrl = require('../controllers/userRole');
const userRoleRouter = express.Router();
const validators = require('../middlewares/userRoles/validators');
const authorize = require('../middlewares/auth/authorize');

userRoleRouter.get('/', authorize(), userRoleCtrl.getAllUserRoles);
userRoleRouter.get('/withoutrights', authorize(), userRoleCtrl.getAllUserRolesWithoutRights);
userRoleRouter.get('/withrightsbymenu/:userRoleId', authorize(), userRoleCtrl.getUserRoleWithRightsByMenu);
userRoleRouter.post('/', authorize(), userRoleCtrl.saveUserRole);
userRoleRouter.put('/:userRoleId', authorize(), userRoleCtrl.updateUserRole);
userRoleRouter.delete('/:userRoleId', authorize(), validators.validateDelete, userRoleCtrl.deleteUserRole);

module.exports = userRoleRouter;