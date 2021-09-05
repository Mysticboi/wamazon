const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const logger = require('../services/logger');

/** This middleware checks the token from authorization headers
 *     If no token is specified or the token signature is invalid the api call is canceled
 *     If the token is valid it decodes it to get the userId and writes in req.body to be easily used by the API
 */
exports.decode = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, secret);
    const { userId } = decodedToken;
    req.body.userId = userId;
    next();
  } catch (e) {
    logger.warn('Unconnected user attempt to call API');
    res.status(404).json({
      error: 'You are not connected',
    });
  }
};
