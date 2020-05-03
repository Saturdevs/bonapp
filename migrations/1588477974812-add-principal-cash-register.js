'use strict'
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const config = require('../config');

module.exports.up = async next => {
  try {
    const mClient = await MongoClient.connect(config.db, { useUnifiedTopology: true });

    const cashRegisters = [
      {
        "name": "Principal",
        "available": true,
        "default": true,
      }
    ]

    const db = mClient.db();
    await db.createCollection('cashregisters');
    await db.collection('cashregisters').insertMany(cashRegisters);
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
    await db.dropCollection("cashregisters"); 
    await mClient.close();
    return next();    
  } catch (err) {
    return next(err);
  }
}