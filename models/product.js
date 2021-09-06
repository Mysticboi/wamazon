const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateOfEnter: { type: Date, default: new Date() },
  images: [
    {
      _id: false,
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Images' },
      imgUrl: String,
    },
  ],
  informations: [
    {
      _id: false,
      name: String,
      value: String,
    },
  ],
  reviews: [
    {
      _id: false,
      comment: String,
      rating: Number,
    },
  ],
  nSold: { type: Number, default: 0 },
});

module.exports = mongoose.model('Product', productSchema);
