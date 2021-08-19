const path = require('path');
const glob = require('glob');
const mongoose = require('mongoose');
const db = require('../../services/database');

const loadModels = () => {
  const modelsGlob = path.join(__dirname, '../../models/*.js');
  glob.sync(modelsGlob).forEach((file) => {
    // eslint-disable-next-line global-require
    require(path.resolve(file));
  });
};

const withDatabase = async (main) => {
  try {
    await db.initialize();

    loadModels();

    const models = mongoose
      .modelNames()
      .reduce((acc, name) => ({ ...acc, [name]: mongoose.model(name) }), {});

    return await main({ models });
  } finally {
    // Error or not, we close the database connection
    await db.disconnect();
  }
};

module.exports.withDatabase = withDatabase;
