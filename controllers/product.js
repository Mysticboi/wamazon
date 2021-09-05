const mongoose = require('mongoose');

const Product = require('../models/product');
const logger = require('../services/logger');

// Setting up GridFSBucket used to retrieve and delete images from mongoDB
const conn = mongoose.connection;
let gridFSBucket;
conn.once('open', () => {
  gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'images',
  });
});

/** Creating a product */
exports.createProduct = async (req, res) => {
  try {
    const { userId } = req.body;
    delete req.body.userId;
    const seller = userId;

    Product.create({ ...req.body, seller });

    res.status(201).json({ message: 'Success creating product' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** Getting stock products of an user with pagination */
exports.getStock = async (req, res) => {
  try {
    const { userId } = req.body;
    let { page = 1, limit = 3 } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const seller = userId;

    let products = await Product.find({ seller })
      .limit(limit)
      .skip((page - 1) * limit);

    products = products.map(
      ({ _id, productName, price, quantity, nSold, images }) => ({
        _id,
        productName,
        price,
        quantity,
        nSold,
        imgUrl:
          images?.length > 0
            ? images[0].imgUrl
            : 'https://upload.wikimedia.org/wikipedia/commons/1/14/Product_sample_icon_picture.png',
      })
    );

    const count = await Product.countDocuments({ seller });

    res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** Deleting a product */
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log('id', productId);

    const { images } = await Product.findById(productId);
    // Deleting all related images first
    if (images?.length > 0) {
      await Promise.all(images.map(({ id }) => gridFSBucket.delete(id)));
    }
    // Deleting the product
    await Product.deleteOne({ _id: productId });

    res.status(200).json({ message: 'Success deleting product' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
