const User = require('../models/user');
const {
  OK, Created, DataError, NotFoundError, ServerError,
} = require('../errors/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send({ users }))
    .catch(() => {
      res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => res.status(Created)
      .send({ newUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(DataError).send({ message: 'Произошла ошибка: переданы некорректные данные' });
      } else {
        res.status(ServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NotFoundError)
          .send({ message: 'Произошла ошибка: пользователь не найден' });
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(DataError).send({ message: 'Произошла ошибка: переданы некорректные данные' });
      } else {
        res.status(ServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(NotFoundError)
          .send({ message: 'Произошла ошибка: пользователь не найден' });
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        res.status(DataError).send({
          message: 'Произошла ошибка: переданы некорректные данные',
        });
        return;
      }
      res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.changeAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        res.status(NotFoundError)
          .send({ message: 'Произошла ошибка: пользователь не найден' });
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        res.status(DataError).send({
          message: 'Произошла ошибка: переданы некорректные данные',
        });
        return;
      }
      res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};
