const { withDatabase } = require('../utils/utils');
const logger = require('../../services/logger');

const main = async ({ models: { GiftCard } }) => {
  await GiftCard.create({ key: '01234567', value: 100 });
};

withDatabase(main)
  .then(() => logger.info('Success applying PDATA'))
  .catch((err) => logger.error(err))
  .finally(() => process.exit());
