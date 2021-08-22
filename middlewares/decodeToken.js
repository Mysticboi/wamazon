const jwt = require('jsonwebtoken');
const { secret } = require('../config');

exports.decode = (req, res, next) => {
  const token = req.headers.authorization;
  const decodedToken = jwt.verify(token, secret);
  const { userId } = decodedToken;

  req.body.userId = userId;
  next();
};
