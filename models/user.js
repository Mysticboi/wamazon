const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  addresses: [
    {
      country: { type: String },
      address: { type: String },
      city: { type: String },
      region: { type: String },
      zipCode: { type: String },
      phoneNumber: { type: String },
    },
  ],
  balance: { type: Number, default: 0 },
});

// Plugin for better error handling with validation
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
