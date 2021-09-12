const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('./config');
const db = require('./services/database');
const logger = require('./services/logger');
const { decode } = require('./middlewares/decodeToken');

const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const giftCardRoutes = require('./routes/giftCard');
const bankAccountRoutes = require('./routes/bankAccount');
const creditCardRoutes = require('./routes/creditCard');
const imagesRoutes = require('./routes/images');
const orderRoutes = require('./routes/order');

const app = express();

const { port } = config;

const api = express.Router();

const startServer = async () => {
  try {
    await db.initialize();

    app.use(express.json());
    app.use(cors());
    app.use(morgan('dev'));

    // Express app serving react app
    app.use(express.static(path.join(__dirname, 'client', 'build')));

    // backend api
    api.use('/user', userRoutes);
    api.use('/product', productRoutes);
    api.use('/giftCard', giftCardRoutes);
    api.use('/bankAccount', bankAccountRoutes);
    api.use('/creditCard', creditCardRoutes);
    api.use('/images', imagesRoutes);
    api.use('/order', decode, orderRoutes);

    app.use('/api', api);

    // catchall route handler. If it's not an api call sends it to front
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });

    app.listen(port, () => {
      logger.info(`Server is running on port: ${port}`);
    });
  } catch (e) {
    logger.error(e);
  }
};

startServer();
