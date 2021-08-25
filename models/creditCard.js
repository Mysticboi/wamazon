const mongoose = require('mongoose');

const creditCardSchema = mongoose.Schema({
  number: { type: String, required: true },
  expiry: { type: String, required: true },
  name: { type: String, required: true },
  cvc: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('CreditCard', creditCardSchema);
