'use strict'

const UserDAO = require('../../dataAccess/user');
const UserRoleDAO = require('../../dataAccess/userRole');
const UserRole = require('../../models/userRole');
const HttpStatus = require('http-status-codes');

async function validateDelete(req, res, next) {
  const ADMIN_ROLE = "admin";
  try {
    let userRoleId = req.params.userRoleId;
    let userRole = new UserRole();
    try {
      userRole = await UserRoleDAO.getUserRoleById(userRoleId);
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: `No se encontró el rol de usuario que se desea borrar en la base de datos: ${err}. Intente nuevamente`
      })
    }
    if (userRole !== null && userRole !== undefined) {
      let validationErrors = [];

      if (userRole.name.toLowerCase() === ADMIN_ROLE) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: `El rol de usuario Admin no puede ser eliminado.`
        });
      }

      //Si existe algún usuario con ese rol, este no puede ser eliminado.
      try {
        let users = await UserDAO.countUsersByRole(userRoleId);

        if (users !== null && users !== undefined && users > 0) {
          validationErrors.push('Existen USUARIOS asociados al mismo.')
        }
      } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: `Hubo un error al querer eliminar el rol de usuario en la validación cantidad de usuarios: ${err}`
        })
      }

      if (validationErrors.length === 0) {
        req.userRole = userRole;
        next();
      } else {
        let validationError = `El rol de usuario (${userRole.name}) no puede ser eliminado debido a que:`

        validationErrors.forEach(message => {
          validationError += '\n\r\t- ' + message;
        });

        return res.status(HttpStatus.CONFLICT).send({ message: validationError })
      }
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `No se encontró el rol de usuario que se desea borrar en la base de datos. Intente nuevamente` })
    }

  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateDelete
}