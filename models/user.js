const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// For no Deprecation warnning
mongoose.set('useCreateIndex', true);

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
  balance: { type: Number },
});

// Plugin for better error handling with validation
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
