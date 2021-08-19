const express = require('express');
const cors = require('cors');
const config = require('./config');
const db = require('./services/database');

const userRoutes = require('./routes/user');

const app = express();

const { port } = config;

const startServer = async () => {
  await db.initialize();

  app.use(express.json());

  app.use(cors());

  app.use('/user', userRoutes);

  app.listen(port, () => {
    console.log('Server is running on port:', port);
  });
};

startServer();
