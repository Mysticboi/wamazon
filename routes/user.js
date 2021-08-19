const express = require('express');
const { signup, login, updatePassword } = require('../controllers/user');

const addressRoutes = require('./address');

const { decode } = require('../middlewares/decodeToken');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/updatePassword', decode, updatePassword);

router.use('/address', decode, addressRoutes);

module.exports = router;
