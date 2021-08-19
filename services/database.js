const mongoose = require('mongoose');
const config = require('../config');
const logger = require('./logger');

class Database {
  constructor() {
    this.uri = config.db.uri;
  }

  async initialize() {
    const connectConfig = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(this.uri, connectConfig);

    logger.info('Successfuly connected to MongoDB');
  }

  async disconnect() {
    try {
      logger.info('Disconnecting mongoose from MongoDB...');

      await mongoose.disconnect();

      logger.info('Mongoose disconnected from MongoDB');
    } catch (err) {
      logger.error(
        err,
        'An error occured while disconneting mongoose from MongoDB'
      );
      throw err;
    }
  }
}

module.exports = new Database();
