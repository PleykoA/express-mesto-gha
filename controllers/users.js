const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/NotFoundError');
const AuthorizationError = require('../errors/AuthorizationError');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');

const checkUser = (user, res) => {
  if (!user) {
    throw new NotFoundError('Нет пользователя с таким id');
  }
  return res.send(user);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      checkUser(user, res);
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          next(new AuthorizationError('Неверные почта или пароль'));
        }
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
          expiresIn: '7d',
        });
        return res.send({ token });
      });
    })
    .catch(next);
};

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      checkUser(user, res);
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорретный Id'));
        return;
      }
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((user) => {
      checkUser(user, res);
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else next(err);
    });
};

const changeAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(BadRequestError('Переданы некорректные данные'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Пользователь не найден'));
      } else next(err);
    });
};

module.exports = {
  login,
  getUsers,
  getUserById,
  updateUser,
  changeAvatar,
  getCurrentUser,
  getMe,
};
