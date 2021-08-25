const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const bankAccountSchema = mongoose.Schema({
  iban: { type: String, required: true, unique: true },
  bic: { type: String, required: true },
  holder: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

// Plugin for better error handling with validation
bankAccountSchema.plugin(uniqueValidator);

module.exports = mongoose.model('BankAccount', bankAccountSchema);
