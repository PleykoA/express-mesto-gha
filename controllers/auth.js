const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequestError'); // 400
const ConflictError = require('../errors/ConflictError');
const AuthorizationError = require('../errors/AuthorizationError');
const NotFoundError = require('../errors/NotFoundError');

const checkUser = (user, res) => {
  if (!user) {
    throw new NotFoundError('Нет пользователя с таким id');
  }
  return res.send(user);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User
      .create({
        name, about, avatar, email, password: hash,
      })
      .then(() => res.status(201).send(
        {
          data: {
            name, about, avatar, email,
          },
        },
      ))
      // eslint-disable-next-line consistent-return
      .catch((err) => {
        if (err.code === 11000) {
          return next(new ConflictError('Пользователь с таким email уже существует'));
        }
        if (err.name === 'ValidationError') {
          return next(new BadRequest('Некорректные данные'));
        }
        next(err);
      });
  })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      checkUser(user, res);
      console.log(user);
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          next(new AuthorizationError('Неверные почта или пароль'));
        }
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
          expiresIn: '7d',
        });
        console.log(token);
        return res.send({ token });
      });
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
};
