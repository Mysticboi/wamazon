const mongoose = require('mongoose');

const Product = require('../models/product');
const logger = require('../services/logger');

const defaultImgUrl =
  'https://upload.wikimedia.org/wikipedia/commons/1/14/Product_sample_icon_picture.png';

const getRating = (reviews) =>
  reviews?.length > 0
    ? (
        reviews.reduce((acc, { rating }) => acc + rating, 0) / reviews.length
      ).toFixed(1)
    : 0;

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

    // If admin we give all the stocks so that he can delete
    const isAdmin = userId === '613df83e608adc86dc981542';
    const filter = isAdmin ? {} : { seller };

    let products = await Product.find(filter)
      .sort({ nSold: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    products = products.map(
      ({ _id, productName, price, quantity, nSold, images, isInShop }) => ({
        _id,
        productName,
        price,
        quantity,
        nSold,
        imgUrl: images?.length > 0 ? images[0].imgUrl : defaultImgUrl,
        isInShop,
      })
    );

    const count = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      isAdmin,
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
    let products = await Product.find({ isInShop: true })
      .sort({ nSold: -1 })
      .limit(8);

    products = products.map(({ _id, productName, price, reviews, images }) => ({
      _id,
      productName,
      price,
      imgUrl: images?.length > 0 ? images[0].imgUrl : defaultImgUrl,
      rating: getRating(reviews),
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
    let products = await Product.find({ isInShop: true });

    // Transform products to data that we need
    products = products.map(({ _id, productName, price, reviews, images }) => ({
      _id,
      productName,
      price,
      imgUrl: images?.length > 0 ? images[0].imgUrl : defaultImgUrl,
      rating: getRating(reviews),
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
    let products = await Product.find({ isInShop: true })
      .sort({ dateOfEnter: -1 })
      .limit(4);

    products = products.map(({ _id, productName, price, reviews, images }) => ({
      _id,
      productName,
      price,
      imgUrl: images?.length > 0 ? images[0].imgUrl : defaultImgUrl,
      rating: getRating(reviews),
    }));

    res.status(200).json({ products });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** Get products to display on shop with pagination */
exports.getProductsShop = async (req, res) => {
  try {
    let { page = 1, limit = 9 } = req.query;
    const { category = '', filter = 'default', search = '' } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const queryFilter = { isInShop: true };
    if (category) {
      queryFilter.category = category;
    }
    if (search) {
      queryFilter.$text = { $search: search };
    }

    let sortFilter;
    if (filter === 'default') sortFilter = {};
    if (filter === 'priceHighToLow') sortFilter = { price: -1 };
    if (filter === 'priceLowToHigh') sortFilter = { price: 1 };

    let products = await Product.find(queryFilter)
      .sort(sortFilter)
      .limit(limit)
      .skip((page - 1) * limit);

    products = products.map(({ _id, productName, price, images, reviews }) => ({
      _id,
      productName,
      price,
      rating: getRating(reviews),
      imgUrl: images?.length > 0 ? images[0].imgUrl : defaultImgUrl,
    }));

    const count = await Product.countDocuments(queryFilter);

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

/** Get products for wishlist, we provide the productIds in the request */
exports.getProductsWishList = async (req, res) => {
  try {
    const { productIds } = req.query;

    let products = await Product.find({ _id: { $in: productIds } });

    products = products.map(({ _id, productName, price, images }) => ({
      _id,
      productName,
      price,
      imgUrl: images?.length > 0 ? images[0].imgUrl : defaultImgUrl,
    }));

    res.status(200).json({ products });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** Get 1 product for the product page */
exports.getProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      const {
        _id,
        productName,
        price,
        reviews,
        images,
        description,
        informations,
        category,
        quantity,
      } = product;

      const finalProduct = {
        _id,
        productName,
        price,
        rating: getRating(reviews),
        quantity,
        description,
        images:
          images?.length > 0
            ? images.map(({ imgUrl }) => ({ imgUrl }))
            : [{ imgUrl: defaultImgUrl }],
        informations,
        reviews,
        category: category || '',
      };

      res.status(200).json({ product: finalProduct });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** Seller updating infos of his stock product */
exports.updateStockProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const { productName, price, quantity, isInShop } = req.body;
    await Product.updateOne(
      { _id: productId },
      { productName, price, quantity, isInShop }
    );
    res.status(200).json({ message: 'Success updating stock product' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** Adding a review */
exports.addReview = async (req, res) => {
  const { productId } = req.params;
  const { name, rating, comment } = req.body;
  try {
    await Product.updateOne(
      { _id: productId },
      { $push: { reviews: { name, rating, comment } } }
    );

    res.status(201).json({ message: 'Success adding review' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
