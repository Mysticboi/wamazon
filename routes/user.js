const express = require('express');
const {
  signup,
  login,
  updatePassword,
  getAllAddresses,
  createAddress,
  deleteAddress,
} = require('../controllers/user');

const { decode } = require('../middlewares/decodeToken');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/updatePassword', decode, updatePassword);
router.get('/address', decode, getAllAddresses);
router.post('/address', decode, createAddress);
router.delete('/address', decode, deleteAddress);

module.exports = router;
