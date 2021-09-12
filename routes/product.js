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
  getProductsWishList,
  getProduct,
  updateStockProduct,
} = require('../controllers/product');

const router = express.Router();

router.post('/', decode, createProduct);
router.get('/stock', decode, getStock);
router.delete('/:productId', decode, deleteProduct);
router.get('/topSellers', getTopSellers);
router.get('/topRated', getTopRated);
router.get('/newArrivals', getNewArrivals);
router.get('/shop', getProductsShop);
router.get('/wishList', getProductsWishList);
router.get('/:productId', getProduct);
router.put('/stock/:productId', decode, updateStockProduct);

module.exports = router;
