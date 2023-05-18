const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new AuthorizationError('Произошла ошибка: необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new AuthorizationError('Произошла ошибка: необходима авторизация'));
  }

  req.user = payload;

  return next();
};
