const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

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
          token: jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', {
            expiresIn: '24h',
          }),
        });
      }
    }
  } catch (error) {
    console.error('error', error);
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/** Deleting user's address */
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    user.addresses = user.addresses.filter(
      (address) => address._id.toString() !== req.body.addressId
    );
    await user.save();
    res.status(200).json({ message: 'Success removing address' });
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
