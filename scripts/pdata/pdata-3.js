const { withDatabase } = require('../utils/utils');
const logger = require('../../services/logger');

const main = async ({ models: { Product } }) => {
  const reviews = [
    {
      comment:
        "Very good product, I've been using it for 2months and it still works just as new",
      rating: 4,
    },
    {
      comment:
        "I've been using this product daily and it's perfect for my needs, it can still get better with a reset option",
      rating: 4,
    },
  ];

  await Product.updateOne(
    { _id: '61353774d9d945598c06c9b1' },
    {
      reviews,
    }
  );
};

withDatabase(main)
  .then(() => logger.info('Success applying PDATA'))
  .catch((err) => logger.error(err))
  .finally(() => process.exit());
