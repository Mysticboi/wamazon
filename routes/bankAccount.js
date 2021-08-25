const express = require('express');
const {
  createBankAccount,
  getBankAccount,
  deleteBankAccount,
} = require('../controllers/bankAccount');
const { decode } = require('../middlewares/decodeToken');

const router = express.Router();

router.post('/', decode, createBankAccount);
router.get('/', decode, getBankAccount);
router.delete('/', decode, deleteBankAccount);

module.exports = router;
