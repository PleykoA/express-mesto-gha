const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthorizationError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new AuthorizationError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};

const Card = require('../models/card');

module.exports = (req, res, next) => {
  Card.findById({ _id: req.params.cardId })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточки с указанным id не существует'));
      }
      if (card.owner.toHexString() !== req.user._id) {
        next(
          new ForbiddenError('У вас нет прав на удаление чужой карточки'),
        );
      }
      return next();
    })
    .catch(next);
};
