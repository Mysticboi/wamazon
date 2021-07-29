const jwt = require('jsonwebtoken');

exports.decode = (req, res, next) => {
  const token = req.headers.authorization;
  const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
  const userId = decodedToken.userId;

  req.body.userId = userId;
  next();
};
