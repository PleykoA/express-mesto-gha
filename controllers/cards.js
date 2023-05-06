const Card = require('../models/card');
const { OK, Created, DataError, NotFoundError, ServerError } = require('../errors/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(() => {
      res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const user = req.user._id;

  return Card.create({ name, link, user })
    .then((card) => res.status(Created).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(DataError).send({ message: 'Произошла ошибка: переданы некорректные данные' });
      } else {
        res.status(ServerError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(NotFoundError)
          .send({ message: 'Произошла ошибка: пользователь не найден' });
      } else {
        res.send({ card });
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

module.exports.likeCard = (req, res) => {

  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: {
        likes: req.user._id
      }
    },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NotFoundError)
          .send({ message: 'Произошла ошибка: пользователь не найден' });
      } else {
        res.status(OK).send({ card });
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

module.exports.removeLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: {
        likes: req.user._id
      }
    },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NotFoundError)
          .send({ message: 'Произошла ошибка: пользователь не найден' });
      } else {
        res.status(OK).send({ card });
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

