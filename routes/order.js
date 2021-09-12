const express = require('express');

const {
  createOrder,
  getOrders,
  getTransactions,
} = require('../controllers/order');

const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/transaction', getTransactions);

module.exports = router;
