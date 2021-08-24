const express = require('express');
const { getGiftCard } = require('../controllers/giftCard');
const { decode } = require('../middlewares/decodeToken');

const router = express.Router();

router.put('/:key', decode, getGiftCard);

module.exports = router;
