const mongoose = require('mongoose');
const logger = require('../services/logger');

// Setting up GridFSBucket used to retrieve and delete images from mongoDB
const conn = mongoose.connection;
let gridFSBucket;
conn.once('open', () => {
  gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'images',
  });
});

exports.uploadImages = async (req, res) => {
  if (!req.files) {
    res.status(400).json({ error: 'No files specified' });
  } else {
    const uploadedFiles = req.files.map(({ id }) => ({
      id,
      imgUrl: `/api/images/${id}`,
    }));
    res.status(201).json({ uploadedFiles });
  }
};

exports.getImage = async (req, res) => {
  try {
    let { imageId } = req.params;
    imageId = mongoose.Types.ObjectId(imageId);

    const response = await gridFSBucket.find({ _id: imageId }).toArray();
    const image = response[0];

    const uploadStream = gridFSBucket.openDownloadStreamByName(image.filename);
    uploadStream.pipe(res);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    let { imageId } = req.params;
    imageId = mongoose.Types.ObjectId(imageId);

    await gridFSBucket.delete(imageId);
    res.status(200).json({ message: 'Success deleting image' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
