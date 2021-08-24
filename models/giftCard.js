const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const giftCardSchema = mongoose.Schema({
  key: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  value: { type: Number, required: true },
});

// Plugin for better error handling with validation
giftCardSchema.plugin(uniqueValidator);

module.exports = mongoose.model('GiftCard', giftCardSchema);
