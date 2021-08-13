const express = require('express');
const {
  signup,
  login,
  updatePassword,
  getAllAddresses,
  createAddress,
  deleteAddress,
  getAddress,
  updateAddress,
} = require('../controllers/user');

const { decode } = require('../middlewares/decodeToken');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/updatePassword', decode, updatePassword);
router.get('/address', decode, getAllAddresses);
router.get('/address/:addressId', decode, getAddress);
router.post('/address', decode, createAddress);
router.delete('/address', decode, deleteAddress);
router.put('/address/:addressId', decode, updateAddress);

module.exports = router;
