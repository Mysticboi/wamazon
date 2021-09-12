const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const BankAccount = require('../models/bankAccount');
const CreditCard = require('../models/creditCard');
const logger = require('../services/logger');

const defaultImgUrl =
  'https://upload.wikimedia.org/wikipedia/commons/1/14/Product_sample_icon_picture.png';

/** Creating order */
exports.createOrder = async (req, res) => {
  const { payment, address, products, totalAmount, userId } = req.body;
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const buyer = userId;
      const finalProducts = products.map(({ _id, quantity }) => ({
        product: _id,
        quantity,
      }));

      const { addresses } = await User.findById(userId);
      const addressOfDelivery = addresses[parseInt(address, 10)];

      // Getting payment method and its information
      const paymentMethod = {};
      if (payment === 'balance') {
        paymentMethod.type = 'balance';
      } else if (payment === 'bankAccount') {
        paymentMethod.type = 'bankAccount';
        const { iban, bic, holder } = await BankAccount.findOne({
          user: userId,
        });
        paymentMethod.bankAccount = { iban, bic, holder };
      } else if (payment.startsWith('creditCard')) {
        paymentMethod.type = 'creditCard';
        const index = parseInt(payment[payment.length - 1], 10);

        const creditCards = await CreditCard.find({ user: userId });
        paymentMethod.creditCard = creditCards[index];
      }

      await Order.create({
        buyer,
        products: finalProducts,
        totalAmount,
        paymentMethod,
        addressOfDelivery,
      });

      // Updating the quantity and nSold of products sold
      await Promise.all(
        finalProducts.map(async ({ productId, quantity }) => {
          await Product.updateOne(
            { _id: productId },
            {
              $inc: {
                nSold: quantity,
                quantity: -quantity,
              },
            }
          );
        })
      );

      // Updating balance if user used his wamazon balance to buy
      if (payment === 'balance') {
        await User.updateOne(
          { _id: userId },
          { $inc: { balance: -totalAmount } }
        );
      }

      res.status(201).json({ message: 'Success creating order' });
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** Getting user's orders */
exports.getOrders = async (req, res) => {
  const { userId } = req.body;
  try {
    let orders = await Order.find({ buyer: userId }).populate(
      'products.product'
    );

    orders = orders.map((order) => {
      const { date, totalAmount, _id, products, addressOfDelivery } = order;
      const { address, city, zipCode, country, phoneNumber } =
        addressOfDelivery;
      const finalOrder = {
        date: date.toUTCString().slice(0, 16),
        totalAmount,
        _id,
        addressOfDelivery: `${address}, ${city}, ${zipCode}, ${country}, Phone number: ${phoneNumber}`,
      };

      const finalProducts = products.map(({ product, quantity }) => {
        const { _id: productId, productName, price, images } = product;
        return {
          _id: productId,
          productName,
          price,
          imgUrl: images?.length > 0 ? images[0].imgUrl : defaultImgUrl,
          quantity,
        };
      });

      finalOrder.products = finalProducts;
      return finalOrder;
    });

    res.status(200).json({ orders });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** Get user's transactions: a transaction is when a user uses his credit card or bank account for an order */
exports.getTransactions = async (req, res) => {
  const { userId } = req.body;
  try {
    let transactions = await Order.find({
      buyer: userId,
      'paymentMethod.type': { $in: ['creditCard', 'bankAccount'] },
    });

    transactions = transactions.map(({ date, totalAmount, paymentMethod }) => {
      const { type } = paymentMethod;
      let value;

      if (type === 'creditCard') {
        const { number } = paymentMethod.creditCard;
        value = `***-${number.slice(number.length - 4, number.length)}`;
      } else {
        const { iban } = paymentMethod.bankAccount;
        value = iban.slice(0, 8).concat('********');
      }

      return {
        date: date.toUTCString().slice(0, 16),
        totalAmount,
        paymentMethod: { type, value },
      };
    });

    res.status(200).json({ transactions });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
