'use strict'

const express = require('express');
const userCtrl = require('../controllers/user');
const userRouter = express.Router();
const authorize = require('../middlewares/auth/authorize');

userRouter.post('/signup', userCtrl.signUp);
userRouter.post('/signin', userCtrl.signIn);
userRouter.get('/:userId', authorize(), userCtrl.getUserById);
userRouter.get('/', authorize(), userCtrl.getUser);
userRouter.post('/', authorize(), userCtrl.saveUser);
userRouter.put('/:userId', authorize(), userCtrl.updateUser);
userRouter.delete('/:userId', authorize(),userCtrl.deleteUser);

module.exports = userRouter;