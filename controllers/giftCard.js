const GiftCard = require('../models/giftCard');
const User = require('../models/user');
const logger = require('../services/logger');

/** Get giftCard by key */
exports.getGiftCard = async (req, res) => {
  try {
    const { key } = req.params;
    const giftCard = await GiftCard.findOne({ key });

    if (giftCard) {
      const { isActive, value } = giftCard;
      if (isActive) {
        await GiftCard.updateOne({ key }, { isActive: false });
        await User.updateOne(
          { _id: req.body.userId },
          { $inc: { balance: value } }
        );
        res.status(200).json({ value });
      } else {
        res.status(400).json({ error: 'Inactive key' });
      }
    } else {
      // Not found giftCard
      res.status(404).json({ error: 'Not found key' });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
