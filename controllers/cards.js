const Card = require('../models/card');
/* const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError'); */

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
module.exports.deleteCard = (req, res) => {
  Card.findOneAndRemove({ _id: req.params.cardId, owner: req.user._id })
    .orFail(() => {
      throw new Error('Произошла ошибка: карточка не найдена');
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({ message: 'карточка не найдена' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      next(new Error('Произошла ошибка: переданы некорректные данные'));
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.removeLikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      next(new Error('Произошла ошибка: переданы некорректные данные'));
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
