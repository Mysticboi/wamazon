const mongoose = require('mongoose');

const Product = require('../models/product');
const logger = require('../services/logger');

const defaultImgUrl =
  'https://upload.wikimedia.org/wikipedia/commons/1/14/Product_sample_icon_picture.png';

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
        imgUrl: images?.length > 0 ? images[0].imgUrl : defaultImgUrl,
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

/** Get top 8 best sellers (most sold) */
exports.getTopSellers = async (req, res) => {
  try {
    let products = await Product.find().sort({ nSold: -1 }).limit(8);

    products = products.map(({ _id, productName, price, reviews, images }) => ({
      _id,
      productName,
      price,
      imgUrl: images?.length > 0 ? images[0].imgUrl : defaultImgUrl,
      rating: (
        reviews.reduce((acc, { rating }) => acc + rating, 0) / reviews.length
      ).toFixed(1),
    }));

    res.status(200).json({ products });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** Get top 8 best rated products */
exports.getTopRated = async (req, res) => {
  try {
    let products = await Product.find();

    // Transform products to data that we need
    products = products.map(({ _id, productName, price, reviews, images }) => ({
      _id,
      productName,
      price,
      imgUrl: images?.length > 0 ? images[0].imgUrl : defaultImgUrl,
      rating:
        reviews?.length > 0
          ? (
              reviews.reduce((acc, { rating }) => acc + rating, 0) /
              reviews.length
            ).toFixed(1)
          : 0,
    }));

    // Sort desc by rating
    products = products.sort(
      (product1, product2) => product2.rating - product1.rating
    );

    // Get first 8 products
    products = products.slice(0, 8);

    res.status(200).json({ products });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** Get 4 latest products */
exports.getNewArrivals = async (req, res) => {
  try {
    let products = await Product.find().sort({ dateOfEnter: -1 }).limit(4);

    products = products.map(({ _id, productName, price, reviews, images }) => ({
      _id,
      productName,
      price,
      imgUrl: images?.length > 0 ? images[0].imgUrl : defaultImgUrl,
      rating: (
        reviews.reduce((acc, { rating }) => acc + rating, 0) / reviews.length
      ).toFixed(1),
    }));

    res.status(200).json({ products });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
