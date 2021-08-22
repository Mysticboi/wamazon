const path = require('path');

const dynamicPath = path.resolve(__dirname, '../', 'config.env');
require('dotenv').config({ path: dynamicPath });

const config = {
  db: {
    uri: process.env.ATLAS_URI,
  },
  port: process.env.PORT || 5000,
  secret: process.env.SECRET || 'RANDOM_TOKEN_SECRET',
};

module.exports = config;
