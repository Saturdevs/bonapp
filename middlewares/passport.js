'use strict'

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = require('../models/user')

passport.use(new LocalStrategy({
  usernameField: 'user[username]',
  passwordField: 'user[password]'
}, (username, password, done) => {
  User.findOne({username: username}, (err, user) => {
    if(!user) {
      return done(null, false, {errors: {'username': 'incorrecto'}})
    }

    if(!user.validPassword(password)){
      return done(null, false, {errors: {'contraseña': 'incorrecta'}})
    }

    return done(null, user)
  }).catch(done)
}))