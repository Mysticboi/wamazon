const express = require('express');
const { createBankAccount } = require('../controllers/bankAccount');
const { decode } = require('../middlewares/decodeToken');

const router = express.Router();

router.post('/', decode, createBankAccount);

module.exports = router;
