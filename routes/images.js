const express = require('express');
const upload = require('../middlewares/uploadImages');
const {
  uploadImages,
  getImage,
  deleteImage,
} = require('../controllers/images');

const router = express.Router();

router.post('/upload', upload, uploadImages);
router.get('/:imageId', getImage);
router.delete('/:imageId', deleteImage);

module.exports = router;
