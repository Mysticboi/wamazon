const { withDatabase } = require('../utils/utils');
const logger = require('../../services/logger');

const main = async ({ models: { User } }) => {
  await User.updateOne(
    { fullName: 'Walid Oulderra' },
    {
      $push: {
        addresses: {
          country: 'France',
          address: '20 Av ALbert Einstein',
          phoneNumber: '065847158',
          city: 'Villeurbanne',
          zipCode: '69100',
          region: 'Rhône',
        },
      },
    }
  );
};

withDatabase(main)
  .then(() => logger.info('Success applying PDATA'))
  .catch((err) => logger.error(err))
  .finally(() => process.exit());
