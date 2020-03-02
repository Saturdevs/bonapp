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
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al crear el usuario: ${err.message}`});
  }
}

async function signIn(req, res, next) {
  try {
    if(!req.body.username){
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send({ errors: {username: 'No puede estar vacío'} })
    }
  
    if(!req.body.password){
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send({ errors: {password: 'No puede estar vacía'} })
    }    

    let user = await UserService.authenticate(req.body);

    if (user) {
      return res.status(HttpStatus.OK).send({ user: user });
    } else {
      return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Nombre de usuario o contraseña incorrectas'});
    }    
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer iniciar sesión: ${err.message}`});
  }      
}

function getUser(req, res, next){
  let userId = req.payload.sub

    User.findById(userId, (err, user) => {
      if(err) res.status(500).send({ message: `Error al realizar la petición al servidor ${err}` })

      if (!user) return res.status(404).send({ message: `El usuario ${userId} no se encuentra registrado en la base de datos`})

      res.status(200).send({ user: user.toAuthJSON() })
    })

}

function updateUser(req, res){
  let userId = req.payload.sub
  let bodyUpdate = req.body
  console.log(bodyUpdate)

  User.findByIdAndUpdate(userId, bodyUpdate, (err, userUpdated) => {
    if (err) return res.status(500).send({ message: `Error al querer actualizar los datos del usuario: ${err}`})
console.log(userUpdated)
    res.status(200).send({ user: userUpdated.toAuthJSON() })
  })

}

module.exports = {
  signUp,
  signIn,
  getUser,
  updateUser
}