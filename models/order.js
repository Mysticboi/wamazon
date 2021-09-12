const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: Number,
      _id: false,
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: {},
  date: { type: Date, default: new Date() },
  addressOfDelivery: {
    country: String,
    address: String,
    city: String,
    region: String,
    zipCode: String,
    phoneNumber: String,
  },
});

module.exports = mongoose.model('Order', orderSchema);
