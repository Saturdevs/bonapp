'use strict'

const express = require('express');
const userCtrl = require('../controllers/user');
const userRouter = express.Router();
const validators = require('../middlewares/user/validators');
const authorize = require('../middlewares/auth/authorize');

userRouter.post('/signup', validators.validateSave, userCtrl.signUp);
userRouter.post('/signin', userCtrl.signIn);
userRouter.get('/pinauthentication/:pin', userCtrl.getUserByPin);
userRouter.get('/:userId', authorize(), userCtrl.getUserById);
userRouter.get('/', authorize(), userCtrl.getUser);
userRouter.post('/', authorize(), validators.validateSave, userCtrl.saveUser);
userRouter.put('/:userId', authorize(), validators.validateSave, userCtrl.updateUser);
userRouter.delete('/:userId', authorize(),userCtrl.deleteUser);

module.exports = userRouter;