'use strict'
const mongodb = require('mongodb');
const migrate = require('migrate');
const MongoClient = mongodb.MongoClient;
const config = require('../config');

class MongoDbStore {
  async load(fn) {
    let client = null;
    let data = null;
    try {
      client = await MongoClient.connect(config.db, { useUnifiedTopology: true });
      const db = client.db();
      data = await db.collection('db_migrations').find().toArray();
      if (data.length !== 1) {
        console.log('Cannot read migrations from database. If this is the first time you run migrations, then this is normal.');
        return fn(null, {});
      }
    } catch (err) {
      throw err
    } finally {
      client.close();
    }
    return fn(null, data[0])
  };

  async save(set, fn) {
    let client = null;
    let result = null;
    try {
      client = await MongoClient.connect(config.db, { useUnifiedTopology: true });
      const db = client.db();
      result = await db.collection('db_migrations')
        .updateOne({}, {
          $set: {
            lastRun: set.lastRun,
          },
          $push: {
            migrations: { $each: set.migrations },
          }
        }, { upsert: true })
    } catch (err) {
      throw err;
    } finally {
      client.close();
    }

    return fn(null, result)
  }
}

module.exports = MongoDbStore;