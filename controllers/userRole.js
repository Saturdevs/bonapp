'use strict'

const UserRoleService = require('../services/userRole');
const HttpStatus = require('http-status-codes');

async function getAllUserRolesWithoutRights(req, res) {
  try {
    let userRoles = await UserRoleService.getAllUserRolesWithoutRights();

    if (userRoles !== null && userRoles !== undefined) {
      res.status(HttpStatus.OK).send({ userRoles: userRoles });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen roles de usuarios registrados en la base de datos.` })
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getAllUserRoles (req, res) {
  try {
    let userRoles = await UserRoleService.getAllUserRoles();

    if (userRoles !== null && userRoles !== undefined) {
      res.status(HttpStatus.OK).send({ userRoles: userRoles });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen roles de usuario en la base da datos` });
    }
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getUserRole (req, res) {
  try {
    let userRoleId = req.params.userRoleId;
    let userRole = await UserRoleService.getUserRole(userRoleId);

    if (userRole !== null && userRole !== undefined) {
      res.status(HttpStatus.OK).send({ userRole: userRole });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `El rol de usuario ${userRoleId} no existe en la base da datos` });
    }
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

module.exports = {
  getAllUserRolesWithoutRights,
  getUserRole,
  getAllUserRoles
}