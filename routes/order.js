const express = require('express');

const { createOrder } = require('../controllers/order');

const router = express.Router();

router.post('/', createOrder);

module.exports = router;
