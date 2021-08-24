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

/** Get bankAccount */
exports.getBankAccount = async (req, res) => {
  try {
    const { userId } = req.body;
    const bankAccount = await BankAccount.findOne({ user: userId });
    if (bankAccount) {
      const { iban, bic, holder } = bankAccount;
      const maskedIban = iban.slice(0, 4).concat('********');
      res.status(200).json({ bankAccount: { iban: maskedIban, bic, holder } });
    } else {
      res.status(404).json({ error: 'Not found bankAccount' });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
