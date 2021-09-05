const { withDatabase } = require('../utils/utils');
const logger = require('../../services/logger');

const main = async ({ models: { User, Product } }) => {
  const { _id } = await User.findOne({ email: 'walidoulderra@hotmail.fr' });
  const productName = 'Sony Camera AX200';
  const price = 200;
  const description = 'A sony camera for taking photos of high quality';
  const quantity = 5;
  const seller = _id;

  await Product.create({ productName, price, description, quantity, seller });
};

withDatabase(main)
  .then(() => logger.info('Success applying PDATA'))
  .catch((err) => logger.error(err))
  .finally(() => process.exit());
