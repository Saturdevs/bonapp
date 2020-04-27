'use strict'

const User = require('../models/user');
const UserService = require('../services/user');
const HttpStatus = require('http-status-codes');

async function signUp(req, res, next) {
  try {
    const user = {
      name: req.body.name,
      lastname: req.body.lastname,
      username: req.body.username,
      password: req.body.password,
      roleId: req.body.roleId,
      signUpDate: Date.now()
    }

    let userSaved = await UserService.create(user);

    res.status(HttpStatus.OK).send({ message: 'El usuario ha sido creado correctamente!' });
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al crear el usuario: ${err.message}` });
  }
}

async function signIn(req, res, next) {
  try {
    if (!req.body.username) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send({ errors: { username: 'No puede estar vacío' } })
    }

    if (!req.body.password) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send({ errors: { password: 'No puede estar vacía' } })
    }

    let user = await UserService.authenticate(req.body);

    if (user) {
      return res.status(HttpStatus.OK).send({ user: user });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Nombre de usuario o contraseña incorrectas' });
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer iniciar sesión: ${err.message}` });
  }
}

async function getUserById(req, res) {
  try {
    let userId = req.params.userId;
    let user = await UserService.getUserById(userId);

    if (user !== null && user !== undefined) {
      res.status(HttpStatus.OK).send({ user });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `El user ${userId} no existe en la base da datos` });
    }
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function getUser(req, res) {
  try {
    let users = await UserService.getAll();

    if (users !== null && users !== undefined) {
      res.status(HttpStatus.OK).send({ users });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `No existen usuarios en la base da datos` });
    }
  }
  catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}

async function updateUser(req, res) {
  let userId = req.params.userId;
  let bodyUpdate = req.body;

  try {
    let updatedUser = await UserService.update(userId ,bodyUpdate);
    if (updatedUser !== null && updatedUser !== undefined) {
      res.status(HttpStatus.OK).send({ updatedUser });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `Ocurrio un error al actualizar el usuario` });
    }
  }
  catch{
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}
/**
 * @description Guarda el usaurio dado como parámetro en la base de datos.
 * @param {User} user usuario que se quiere guardar en la base de datos.
 * @returns usuario guardado en la base de datos.
 */
async function saveUser(req, res) {
  try {
    const user = {
      name: req.body.name,
      lastname: req.body.lastname,
      username: req.body.username,
      password: req.body.password,
      roleId: req.body.roleId,
      signUpDate: Date.now()
    }

    let savedUser = await UserService.create(user);
    if (savedUser !== null && savedUser !== undefined) {
      res.status(HttpStatus.OK).send({ savedUser });
    }
    else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `Ocurrio un error al dar de alta el usuario` });
    }
  }
  catch{
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}
/**
 * @description Elimina el usuario con id igual al dado como parámetro de la base de datos.
 */
async function deleteUser(req, res) {
  try {
    let userId = req.params.userId;
    let user = await UserService.getUserById(userId);
    let deletedUser = UserService.deleteUser(user);
    if (deletedUser !== null && deletedUser !== undefined) {
      res.status(HttpStatus.OK).send({ deletedUser });
    } else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `Ocurrio un error al dar de baja el usuario` });
    }
  }
  catch(err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la petición al servidor ${err}` });
  }
}


module.exports = {
  signUp,
  signIn,
  getUser,
  updateUser,
  getUserById,
  saveUser,
  deleteUser
}