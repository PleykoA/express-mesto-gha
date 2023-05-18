const { CastError, ValidationError } = require('mongoose').Error;
const {
  DataError,
  ConflictError,
  ServerError,
} = require('./TypeErrors');
const NotFoundError = require('./NotFoundError');
const ForbiddenError = require('./ForbiddenError');
const AuthorizationError = require('./AuthorizationError');

module.exports = ((err, req, res, next) => {
  if (err instanceof CastError || err instanceof ValidationError) {
    return res.status(DataError).send({ message: 'Произошла ошибка: переданы некорректные данные' });
  }

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err instanceof ForbiddenError) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err instanceof AuthorizationError) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err.code === 11000) {
    return res.status(ConflictError).send({ message: 'Пользователь уже зарегистрирован' });
  }

  res.status(ServerError).send({ message: 'Произошла ошибка' });

  return next();
});
