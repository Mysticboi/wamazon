const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      ...req.body,
      password: hash,
    });

    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    let response = { message: 'Failed SigningUp user' };

    if (error?.errors?.email?.kind === 'unique') {
      response.error = 'Not unique email';
    }
    res.status(400).json(response);
  }
};
