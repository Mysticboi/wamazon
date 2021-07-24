const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');

const app = express();

require('dotenv').config({ path: './config.env' });

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Successfly connected to mongoDB');

    app.use(express.json());

    app.use(cors());

    app.use('/user', userRoutes);

    app.listen(port, () => {
      console.log('Server is running on port:', port);
    });
  } catch (error) {
    console.error('Failed connection to mongoDB');
  }
};

startServer();
