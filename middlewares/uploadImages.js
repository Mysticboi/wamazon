const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const { db } = require('../config');

const storage = new GridFsStorage({
  url: db.uri,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ['image/png', 'image/jpeg'];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-wamazon-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: 'images',
      filename: `${Date.now()}-wamazon-${file.originalname}`,
    };
  },
});

module.exports = multer({ storage }).array('multi-files', 5);
