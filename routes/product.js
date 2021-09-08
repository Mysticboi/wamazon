const express = require('express');
const { decode } = require('../middlewares/decodeToken');
const {
  createProduct,
  getStock,
  deleteProduct,
  getTopSellers,
  getTopRated,
  getNewArrivals,
  getProductsShop,
} = require('../controllers/product');

const router = express.Router();

router.post('/', decode, createProduct);
router.get('/stock', decode, getStock);
router.delete('/:productId', decode, deleteProduct);
router.get('/topSellers', getTopSellers);
router.get('/topRated', getTopRated);
router.get('/newArrivals', getNewArrivals);
router.get('/shop', getProductsShop);

module.exports = router;
