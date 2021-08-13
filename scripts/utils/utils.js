const mongoose = require('mongoose');
const path = require('path');
const glob = require('glob');

require('dotenv').config({ path: '../../config.env' });

const loadModels = () => {
  const modelsGlob = path.join(__dirname, '../../models/*.js');
  glob.sync(modelsGlob).forEach((file) => {
    require(path.resolve(file));
  });
};

const withDatabase = async (main) => {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Successfly connected to mongoDB');

    loadModels();

    const models = mongoose
      .modelNames()
      .reduce((acc, name) => ({ ...acc, [name]: mongoose.model(name) }), {});

    return await main({ models });
  } finally {
    // Error or not, we close the database connection
    await mongoose.disconnect();
  }
};

module.exports.withDatabase = withDatabase;
