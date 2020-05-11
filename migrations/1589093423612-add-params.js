'use strict'
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const config = require('../config');

module.exports.up = async next => {
  let mClient = null;
  try {
    mClient = await MongoClient.connect(config.db, { useUnifiedTopology: true });

    const param = [
      {
        "_id": "ask.for.user.pin",
        "description": "si es true se le pide el pin al usuario cuando quiere agregar productos a un pedido para identificarlo",
        "value": true,
      }
    ]

    const db = mClient.db();
    await db.createCollection('params');
    await db.collection('params').insertMany(param);    
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
    await db.dropCollection("params"); 
    await mClient.close();
    return next();    
  } catch (err) {
    return next(err);
  }
}