'use strict'

const User = require('../models/user')
const passport = require('passport')

function signUp(req, res, next) {
  const user = new User({
    username: req.body.user.username,
    phone: req.body.user.phone,
    name: req.body.user.name,
    lastname: req.body.user.lastname,
    password: req.body.user.password
  })
  
  user.save((err, user) => {
    if(err) return res.status(500).send({ message: `Error al crear el usuario: ${err}`})

    res.status(200).send({ user: user.toAuthJSON() })
  })
}

function signIn(req, res, next) {
  if(!req.body.user.username){
    return res.status(422).send({ errors: {username: 'No puede estar vacío'} })
  }

  if(!req.body.user.password){
    return res.status(422).send({ errors: {password: 'No puede estar vacía'} })
  }

  passport.authenticate('local', {session: false}, (err, user, info) => {
    if(err){ return next(err) }

    if(user){      
      user.token = user.generateJWT()
      return res.status(200).send({
        message: 'Logueado correctamente',
        user: user.toAuthJSON()
      })
    } else {
      return res.status(422).send(info)
    }
  })(req, res, next)  
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