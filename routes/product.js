const express = require('express');
const { decode } = require('../middlewares/decodeToken');
const {
  createProduct,
  getStock,
  deleteProduct,
} = require('../controllers/product');

const router = express.Router();

router.post('/', decode, createProduct);
router.get('/stock', decode, getStock);
router.delete('/:productId', decode, deleteProduct);

module.exports = router;
