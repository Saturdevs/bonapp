'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserRole = require('../models/userRole');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config');

const userSchema = Schema({
  name: { type: String },
  lastname: { type: String },
  phone: { type: String },
  username: { type: String, lowercase: true, required: [true, "no puede estar vacío"], unique: true, index: true},
  roleId: { type: Schema.Types.ObjectId, ref: UserRole, required: true},
  password: { type: String, required: true },
  signUpDate: { type: Date, default: Date.now() },
  lastLogin: { type: Date },
  salt: { type: String }
}, {timestamps: true});

userSchema.pre('save', function (next) {
  let user = this
  if(!user.isModified('password')) return next()

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)

    user.salt = salt

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if(err) return next(err)

      user.password = hash
      next()
    })
  })
});

userSchema.methods.validPassword = function(password) {  
  if(this.password != null) {        
    return bcrypt.compareSync(password, this.password)
  } else {    
    return false;
  }  
};

userSchema.methods.generateJWT = function() {
  let user = this
  const payload = {
    sub: user._id,
    username: user.username,
    iat: moment().unix(),
    exp: moment().add(60, 'days').unix()
  }

  return jwt.sign(payload, config.SECRET_TOKEN)
};

userSchema.methods.toAuthJSON = function(){

  return {
    username: this.username,
    token: this.generateJWT()
  }
};

module.exports = mongoose.model('User', userSchema);