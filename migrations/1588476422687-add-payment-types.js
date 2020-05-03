'use strict'
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const config = require('../config');

module.exports.up = async next => {
  try {
    const mClient = await MongoClient.connect(config.db, { useUnifiedTopology: true });

    const paymentTypes = [
      {
        "name": "Efectivo",
        "available": true,
        "default": true,
        "currentAccount": false
      }, 
      {
        "name": "Cuenta Corriente",
        "available": true,
        "default": false,
        "currentAccount": true
      }
    ]

    const db = mClient.db();
    await db.createCollection('paymenttypes'); //Si la colección ya existe no la vuelve a crear.
    await db.collection('paymenttypes').insertMany(paymentTypes);
    await mClient.close();
    return next();
  } catch (err) {
    return next(err);   
  }  
}

module.exports.down = async next => {
  try {
    const mClient = await MongoClient.connect(config.db, { useUnifiedTopology: true });
    const db = mClient.db();
    await db.dropCollection('paymenttypes'); 
    await mClient.close();
    return next();    
  } catch (err) {
    return next(err);
  }
}