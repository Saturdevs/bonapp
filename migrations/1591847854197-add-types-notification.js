'use strict'
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const config = require('../config');

module.exports.up = async function (next) {
  let mClient = null;
  try {
    mClient = await MongoClient.connect(config.db, { useUnifiedTopology: true });

    const notificationTypes = [
      {
        '_id': 'TABLE_TAKEN',
        'message': 'Se ha ocupado la mesa número',
        'duration': 10,
        'repeatTime': 300,
        'repeatAttempts': 0
      }, 
      {
        '_id': 'NEW_ORDER',
        'message': 'Un nuevo pedido fue realizado en la mesa número',
        'duration': 10,
        'repeatTime': 60,
        'repeatAttempts': 5
      },
      {
        '_id': 'CALL_WAITER',
        'message': 'Se solicita un mozo en la mesa número',
        'duration': 10,
        'repeatTime': 60,
        'repeatAttempts': 5
      }
    ]

    const db = mClient.db();
    await db.createCollection('notificationtypes'); //Si la colección ya existe no la vuelve a crear.
    await db.collection('notificationtypes').insertMany(notificationTypes);    
    return next();
  } catch (err) {
    return next(err);   
  } finally {
    mClient.close();
  } 
}

module.exports.down = async function (next) {
  try {
    const mClient = await MongoClient.connect(config.db, { useUnifiedTopology: true });
    const db = mClient.db();
    await db.dropCollection('notificationtypes'); 
    await mClient.close();
    return next();    
  } catch (err) {
    return next(err);
  }
}
