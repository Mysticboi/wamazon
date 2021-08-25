const express = require('express');
const {
  createCreditCard,
  getCreditCards,
  deleteCreditCard,
} = require('../controllers/creditCard');
const { decode } = require('../middlewares/decodeToken');

const router = express.Router();

router.post('/', decode, createCreditCard);
router.get('/', decode, getCreditCards);
router.delete('/:creditCardId', deleteCreditCard);

module.exports = router;
