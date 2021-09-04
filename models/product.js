const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  informations: [
    {
      name: String,
      information: String,
    },
  ],
  reviews: [
    {
      comment: String,
      rating: Number,
    },
  ],
  nSold: { type: Number, default: 0 },
});

module.exports = mongoose.model('Product', productSchema);
