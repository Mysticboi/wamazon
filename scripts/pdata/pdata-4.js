const { withDatabase } = require('../utils/utils');
const logger = require('../../services/logger');

const main = async ({ models: { Product } }) => {
  await Product.updateMany({}, { isInShop: true });
};

withDatabase(main)
  .then(() => logger.info('Success applying PDATA'))
  .catch((err) => logger.error(err))
  .finally(() => process.exit());
