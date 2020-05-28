'use strict'

const UserDAO = require('../../dataAccess/user');
const bcrypt = require('bcrypt-nodejs');
const _ = require('lodash');
const HttpStatus = require('http-status-codes');

async function validateSave(req, res, next) {
  try {
    const userId = req.body._id;
    const newPin = req.body.pin;
    //Si se va a actualizar el pin de usuario tengo que checkear que no haya otro usuario ya
    //guardado en la base de datos con el mismo pin.
    if (newPin) {
      let found = false;
      let users = null;
      let userWithSamePin = null;
      //Si el id existe en el req.body quiere decir que es una actualización de usuario y no un alta.
      //Si el pin es el mismo que el usuario ya tiene almacenado en la bd sigo con la actualizacion,
      //sino sigo con la validación.
      if (userId) {
        let user = await UserDAO.getUserById(userId);
        if (user.pin && bcrypt.compareSync(newPin, user.pin)) {
          return next();
        }
      }

      users = await UserDAO.getUsersSortedByQuery();

      if (users !== null && users !== undefined && users.length > 0) {        
        for (let i = 0; i < users.length && !found; i++) {
          userWithSamePin = users[i];
          if (_.get(userWithSamePin, 'pin') && 
              bcrypt.compareSync(newPin, userWithSamePin.pin)) {
            found = true;
          }
        }

        if (found && userWithSamePin !== null && userWithSamePin !== undefined 
            && userWithSamePin._id.toString() !== userId) {
            res.status(HttpStatus.CONFLICT).send({ message: `Ya existe un usuario con el mismo PIN. Por favor, elija uno distinto` });
        } else {
          next();
        }
      }
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  validateSave
}