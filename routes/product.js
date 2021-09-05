const express = require('express');
const { decode } = require('../middlewares/decodeToken');
const { createProduct } = require('../controllers/product');

const router = express.Router();

router.post('/', decode, createProduct);

module.exports = router;
