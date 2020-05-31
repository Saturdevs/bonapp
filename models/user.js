'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserRole = require('../models/userRole');
const bcrypt = require('bcrypt-nodejs');

const userSchema = Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, lowercase: true, required: [true, "no puede estar vacío"], unique: true, index: true },
  password: { type: String, required: true },
  roleId: { type: Schema.Types.ObjectId, ref: UserRole, required: true },
  signUpDate: { type: Date, default: Date.now() },
  lastLogin: { type: Date },
  isGeneral: { type: Boolean, required: true },
  pin: { type: String }
}, { timestamps: true });

userSchema.pre('save', function (next) {  
  let user = this
  if(!user.isModified('password') && !user.isModified('pin')) return next()  

  try {
    const salt = bcrypt.genSaltSync(10);

    if (user.isModified('password')) {      
      const hash = bcrypt.hashSync(user.password, salt);
      user.password = hash;
      if (!user.isModified('pin')) {
        next();
      }
    }

    if (user.pin && user.isModified('pin')) {       
      const hash = bcrypt.hashSync(user.pin, salt);
      user.pin = hash;           
      next();
    }

    next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.toAuthJSON = function(){

  return {
    username: this.username,
    token: this.generateJWT()
  }
};

module.exports = mongoose.model('User', userSchema);