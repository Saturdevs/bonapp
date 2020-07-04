'use strict'
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const config = require('../config');

module.exports.up = async next => {
  let mClient = null;
  try {
    mClient = await MongoClient.connect(config.db, { useUnifiedTopology: true });

    const paymentTypes = [
      {
        "name": "Efectivo",
        "available": true,
        "default": true,
        "currentAccount": false,
        "cash": true
      }, 
      {
        "name": "Cuenta Corriente",
        "available": true,
        "default": false,
        "currentAccount": true,
        "cash": false
      }
    ]

    const db = mClient.db();
    await db.createCollection('paymenttypes'); //Si la colección ya existe no la vuelve a crear.
    await db.collection('paymenttypes').insertMany(paymentTypes);    
    return next();
  } catch (err) {
    return next(err);   
  } finally {
    mClient.close();
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