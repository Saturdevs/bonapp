'use strict'

const express = require('express');
const userCtrl = require('../controllers/user');
const userRouter = express.Router();

userRouter.post('/signup', userCtrl.signUp);
userRouter.post('/signin', userCtrl.signIn);
userRouter.get('/:userId', userCtrl.getUserById);
userRouter.get('/', userCtrl.getUser);
userRouter.post('/', userCtrl.saveUser);
userRouter.put('/:userId', userCtrl.updateUser);
userRouter.delete('/:userId',userCtrl.deleteUser);

module.exports = userRouter;