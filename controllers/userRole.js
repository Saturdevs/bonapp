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

async function getUserRoleWithRightsByMenu (req, res) {
  try {
    let userRoleId = req.params.userRoleId;
    let userRole = await UserRoleService.getUserRoleWithRightsByMenu(userRoleId);

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

async function saveUserRole(req, res) {
  try {
    let userRoleSaved = await UserRoleService.saveUserRole(req.body);

    res.status(HttpStatus.OK).send({ userRole: userRoleSaved });
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
  }
}

async function updateUserRole(req, res) {
  try {
    let userRoleId = req.params.userRoleId;
    let bodyUpdate = req.body;

    let userRoleUpdated = await UserRoleService.update(userRoleId, bodyUpdate);
    res.status(HttpStatus.OK).send({ userRole: userRoleUpdated });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer actualizar el rol de usuario: ${err.message}.` });
  }
}

async function deleteUserRole(req, res) {
  let userRole = req.userRole;

  if (userRole === null && userRole === undefined) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      message: `No se encontró el rol de usuario que se desea borrar en la base de datos. Intente nuevamente`
    })
  }

  try {
    await UserRoleService.deleteUserRole(userRole);
    res.status(HttpStatus.OK).send({ message: `El rol de usuario ha sido eliminado` });    
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer borrar el rol de usuario: ${err.message}` })        
  }
}

module.exports = {
  getAllUserRolesWithoutRights,
  getUserRoleWithRightsByMenu,
  saveUserRole,
  updateUserRole,
  deleteUserRole
}