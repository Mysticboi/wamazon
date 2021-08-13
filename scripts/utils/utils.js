const mongoose = require('mongoose');

require('dotenv').config({ path: '../../config.env' });

const withDatabase = async (main) => {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Successfly connected to mongoDB');

    return await main();
  } catch (error) {
    return Promise.reject('Failed connecting to Database');
  } finally {
    // Error or not, we close the database connection
    await mongoose.disconnect();
  }
};

module.exports.withDatabase = withDatabase;
