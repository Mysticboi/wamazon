const express = require('express');
const {
  getAllAddresses,
  createAddress,
  deleteAddress,
  getAddress,
  updateAddress,
} = require('../controllers/user');

const router = express.Router();

router.get('/', getAllAddresses);
router.get('/:addressId', getAddress);
router.post('/', createAddress);
router.delete('/', deleteAddress);
router.put('/:addressId', updateAddress);

module.exports = router;
