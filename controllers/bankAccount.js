const BankAccount = require('../models/bankAccount');
const logger = require('../services/logger');

/** Create bankAccount */
exports.createBankAccount = async (req, res) => {
  try {
    const { userId, iban, bic, holder } = req.body;
    await BankAccount.create({ iban, bic, holder, user: userId });
    res.status(201).json({ message: 'Success creating bank account' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
