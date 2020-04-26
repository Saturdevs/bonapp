'use strict'

const express = require('express');
const userRoleCtrl = require('../controllers/userRole');
const userRoleRouter = express.Router();
const validators = require('../middlewares/userRoles/validators');

userRoleRouter.get('/', userRoleCtrl.getAllUserRoles);
userRoleRouter.get('/withoutrights', userRoleCtrl.getAllUserRolesWithoutRights);
userRoleRouter.get('/withrightsbymenu/:userRoleId', userRoleCtrl.getUserRoleWithRightsByMenu);
userRoleRouter.post('/', userRoleCtrl.saveUserRole);
userRoleRouter.put('/:userRoleId', userRoleCtrl.updateUserRole);
userRoleRouter.delete('/:userRoleId', validators.validateDelete, userRoleCtrl.deleteUserRole);

module.exports = userRoleRouter;