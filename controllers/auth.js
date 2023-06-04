const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');

const { NODE_ENV, JWT_SECRET = 'dev-secret' } = process.env;

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(
          'Переданы некорректные данные',
        ));
      } else if (err.code === 11000) {
        next(new ConflictError(
          'Пользователь с таким email уже существует',
        ));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: (7 * 24 * 60 * 60),
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Вы успешно авторизовались!' })
        .end();
    })
    .catch(next);
};

const logout = (_, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
};

module.exports = {
  createUser,
  login,
  logout,
};
