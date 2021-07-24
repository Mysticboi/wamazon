const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

require('dotenv').config({ path: './config.env' });

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Successfly connected to mongoDB');

    app.use(express.json());

    app.use(cors());

    app.listen(port, () => {
      console.log('Server is running on port:', port);
    });
  })
  .catch(() => console.error('Failed connection to mongoDB'));
