const { withDatabase } = require('../utils/utils');

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
  .then(() => console.log('Success applying PDATA'))
  .catch((err) => console.error('Failed applying PDATA', err))
  .finally(() => process.exit());
