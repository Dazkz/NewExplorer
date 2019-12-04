require('dotenv').config();
const jwt = require('jsonwebtoken');

const AuthError = require('../errors/auth-error');
const errMessages = require('../consts/errorMessages');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthError(errMessages.authErrorMessage));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    const error = new AuthError(errMessages.authErrorMessage);
    next(error);
  }

  req.user = payload;
  return next();
};
