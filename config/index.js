const path = require('path');

const dynamicPath = path.resolve(__dirname, '../', 'config.env');
require('dotenv').config({ path: dynamicPath });

const config = {
  db: {
    uri: process.env.ATLAS_URI || 'mongodb://localhost:27017/wamazonDatabase',
  },
  port: process.env.PORT || 5000,
  secret: process.env.SECRET || 'RANDOM_TOKEN_SECRET',
  nodemailer: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
};

module.exports = config;
