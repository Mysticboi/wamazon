const CreditCard = require('../models/creditCard');
const logger = require('../services/logger');

/** Create credit card */
exports.createCreditCard = async (req, res) => {
  try {
    const { userId, number, expiry, name, cvc } = req.body;
    await CreditCard.create({
      number,
      expiry,
      name,
      cvc,
      user: userId,
    });

    const { _id } = await CreditCard.findOne({ number, user: userId });

    res
      .status(201)
      .json({ message: 'Success creating credit card', creditCardId: _id });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** Get all user's creditCards */
exports.getCreditCards = async (req, res) => {
  try {
    const { userId } = req.body;
    let creditCards = await CreditCard.find({ user: userId });
    creditCards = creditCards.map(({ number, expiry, name, _id }) => {
      const maskedNumber = `***-${number.slice(
        number.length - 4,
        number.length
      )}`;

      return { number: maskedNumber, expiry, name, _id };
    });

    res.status(200).json({ creditCards });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** Delete credit card */
exports.deleteCreditCard = async (req, res) => {
  try {
    const { creditCardId } = req.params;
    await CreditCard.deleteOne({ _id: creditCardId });
    res.status(200).json({ message: 'Success removing credit card' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
