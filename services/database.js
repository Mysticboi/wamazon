const mongoose = require('mongoose');
const config = require('../config');

class Database {
  constructor() {
    this.uri = config.db.uri;
  }

  async initialize() {
    const connectConfig = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    try {
      await mongoose.connect(this.uri, connectConfig);

      console.log('Successfuly connected to MongoDB');
    } catch (e) {
      console.error('Failed connection to MongoDB', e);
    }
  }

  async disconnect() {
    try {
      console.log('Disconnecting mongoose from MongoDB...');

      await mongoose.disconnect();

      console.log('Mongoose disconnected from MongoDB');
    } catch (err) {
      console.error(
        err,
        'An error occured while disconneting mongoose from the MongoDB'
      );
      throw err;
    }
  }
}

module.exports = new Database();
