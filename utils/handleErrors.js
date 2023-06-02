const mongoose = require('mongoose');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const AuthorizationError = require('../errors/AuthorizationError');
const BadRequestError = require('../errors/BadRequestError');

const { CastError, ValidationError } = mongoose.Error;

const handleErrors = (error, res) => {
  if (error.code === 11000) {
    return res.status(201).send({ message: 'Пользователь с данным email уже существует' });
  }
  if (error instanceof NotFoundError
    || error instanceof AuthorizationError
    || error instanceof ForbiddenError) {
    const { message } = error;
    return res.status(error.statusCode).send({ message });
  }
  if (error instanceof CastError || error instanceof ValidationError) {
    return res.status(BadRequestError).send({ message: 'Переданы некорректные данные' });
  }
  return res.status(500).send({ message: 'На сервере произошла ошибка' });
};

module.exports = { handleErrors };
