const express = require('express');
const uploadImages = require('../middlewares/uploadImages');

const router = express.Router();

router.post('/upload', uploadImages, async (req, res) => {
  console.log(req.files);
  res.send('Hello');
});

module.exports = router;
