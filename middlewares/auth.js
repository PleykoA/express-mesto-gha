const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

const { NODE_ENV, JWT_SECRET = 'dev-secret' } = process.env;

const auth = (req, _, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(
      token,
      `${NODE_ENV === 'production'
        ? JWT_SECRET
        : 'dev-secret'}`,
    );
  } catch (err) {
    throw new AuthorizationError('Ошибка: неверный электронный адрес или пароль');
  }

  req.user = payload;

  next();
};

module.exports = auth;
