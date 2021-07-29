const express = require('express');
const { signup, login, updatePassword } = require('../controllers/user');

const { decode } = require('../middlewares/decodeToken');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/updatePassword', decode, updatePassword);

module.exports = router;
