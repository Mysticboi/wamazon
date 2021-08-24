const express = require('express');
const {
  createBankAccount,
  getBankAccount,
} = require('../controllers/bankAccount');
const { decode } = require('../middlewares/decodeToken');

const router = express.Router();

router.post('/', decode, createBankAccount);
router.get('/', decode, getBankAccount);

module.exports = router;
