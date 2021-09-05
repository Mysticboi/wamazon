const Product = require('../models/product');
const logger = require('../services/logger');

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
