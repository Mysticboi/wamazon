const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/user');
const { secret } = require('../config');
const logger = require('../services/logger');
const { sendEmail } = require('../services/nodemailer');

/** Signing Up the user and crypting his password  */
exports.signup = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      ...req.body,
      password: hash,
    });

    await user.save();
    // Or await User.create({...req.body,password: hash});
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    const response = { message: 'Failed SigningUp user' };

    if (error?.errors?.email?.kind === 'unique') {
      response.error = 'Not unique email';
    }
    res.status(400).json(response);
  }
};

/** Login in the user and creating an authentification token */
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res
        .status(404)
        .json({ message: 'Failed Login user', error: 'Email not found' });
    } else {
      const valid = await bcrypt.compare(req.body.password, user.password);
      if (!valid) {
        res
          .status(401)
          .json({ message: 'Failed Login user', error: 'Wrong Password' });
      } else {
        // Sending a new authentificaiton token
        res.status(200).json({
          fullName: user.fullName,
          token: jwt.sign({ userId: user._id }, secret, {
            expiresIn: '24h',
          }),
        });
      }
    }
  } catch (error) {
    logger.error('error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** Updating user's password */
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    const valid = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!valid) {
      res.status(401).json({
        message: "Failed update user's password",
        error: 'Wrong Password',
      });
    } else {
      const hash = await bcrypt.hash(req.body.password, 10);
      await User.updateOne({ _id: req.body.userId }, { password: hash });
      res.status(200).json({ message: "Success updating user's password" });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** Getting all user's addresses */
exports.getAllAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    const { addresses } = user;
    res.status(200).json({ addresses });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** Adding user's address */
exports.createAddress = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    const address = req.body;
    delete address.userId;

    user.addresses.push(address);
    await user.save();
    res.status(200).json({ message: 'Success creating address' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** Deleting user's address */
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    user.addresses = user.addresses.filter(
      (address) => address._id.toString() !== req.params.addressId
    );
    await user.save();
    res.status(200).json({ message: 'Success removing address' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** Getting a user's address */
exports.getAddress = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    const address = user.addresses.find(
      (adrs) => adrs._id.toString() === req.params.addressId
    );
    res.status(200).json({ address });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** Updating user's address */
exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    const inputAddress = req.body;
    delete inputAddress.userId;
    const { address, city, region, zipCode, phoneNumber } = inputAddress;
    const { addressId } = req.params;
    user.addresses = user.addresses.map((adr) => {
      const finalAddress =
        adr._id.toString() === addressId
          ? { addressId, address, city, region, zipCode, phoneNumber }
          : adr;

      return finalAddress;
    });

    await user.save();
    res.status(200).json({ message: 'Success updating address' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** Verify if token expired */
exports.verifyTokenExpired = (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ message: 'Token missing' });
  }
  jwt.verify(token, secret, (err) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        res.status(400).json({ message: 'Expired token' });
      }
    } else {
      res.status(200).json({ message: 'Unexpired token' });
    }
  });
};

/** Get user current balance */
exports.getBalance = async (req, res) => {
  try {
    const { balance } = await User.findById(req.body.userId);
    // Temporary: if user doesn't have balance field we create it
    if (balance === undefined) {
      logger.info('Undefined balance');
      await User.updateOne({ _id: req.body.userId }, { balance: 0 });
      res.status(200).json({ balance: 0 });
    } else {
      logger.info('Good balance');
      res.status(200).json({ balance });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** Forgotten password */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(404)
        .json({ message: 'Failed forgotPassword', error: 'Email not found' });
    } else {
      const randomPassword = crypto.randomBytes(5).toString('hex');
      const hash = await bcrypt.hash(randomPassword, 10);
      user.password = hash;
      await user.save();

      const mailOptions = {
        from: '"Wamazon" <walidoulderra@hotmail.fr>',
        to: email,
        subject: 'Forgotten password on wamazon.com',
        html: `<h2>Hello ${user.fullName},</h2> <p>Your new password is <b>${randomPassword}</b> .</p> <p>You can use it to login and then go to your account and change your password.</p>`,
      };

      await sendEmail(mailOptions);

      res.status(200).json({ message: 'Email sent to user' });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
