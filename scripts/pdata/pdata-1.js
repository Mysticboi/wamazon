const User = require('../../models/user');

const { withDatabase } = require('../utils/utils');

const main = async () => {
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
  .then(() => console.log('Succesfly applied PDATA'))
  .catch((error) => console.error(error))
  .finally(() => process.exit());
