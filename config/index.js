require('dotenv').config({ path: './config.env' });

const config = {
  db: {
    uri: process.env.ATLAS_URI,
  },
  port: process.env.PORT || 5000,
};

module.exports = config;
