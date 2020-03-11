'use strict'

const express = require('express');
const userCtrl = require('../controllers/user');
const userRouter = express.Router();

userRouter.post('/signup', userCtrl.signUp);
userRouter.post('/signin', userCtrl.signIn);
userRouter.get('/', userCtrl.getUser);
userRouter.put('/', userCtrl.updateUser);

module.exports = userRouter;