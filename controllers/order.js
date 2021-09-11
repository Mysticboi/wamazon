const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const BankAccount = require('../models/bankAccount');
const CreditCard = require('../models/creditCard');
const logger = require('../services/logger');

/** Creating order */
exports.createOrder = async (req, res) => {
  const { payment, address, products, totalAmount, userId } = req.body;
  console.log('called');
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      console.log('arrived');
      const buyer = userId;
      const finalProducts = products.map(({ _id, quantity }) => ({
        productId: _id,
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
