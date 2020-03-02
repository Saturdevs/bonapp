'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserRole = require('../models/userRole');
const bcrypt = require('bcrypt-nodejs');

const userSchema = Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, lowercase: true, required: [true, "no puede estar vacío"], unique: true, index: true},
  password: { type: String, required: true },
  roleId: { type: Schema.Types.ObjectId, ref: UserRole, required: true},  
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

userSchema.methods.toAuthJSON = function(){

  return {
    username: this.username,
    token: this.generateJWT()
  }
};

module.exports = mongoose.model('User', userSchema);