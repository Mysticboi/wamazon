const { withDatabase } = require('../utils/utils');
const logger = require('../../services/logger');

const main = async ({ models: { GiftCard } }) => {
  await GiftCard.create({ key: '12345678', value: 20 });
};

withDatabase(main)
  .then(() => logger.info('Success applying PDATA'))
  .catch((err) => logger.error(err))
  .finally(() => process.exit());
