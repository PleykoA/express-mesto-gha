const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError('Произошла ошибка: переданы некорректные данные'),
        );
        return;
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => {
      next(new ForbiddenError('Нет карточки по заданному id'));
    })
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      } else {
        return Card.deleteOne(card).then(() => res.send({ data: card }));
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      next(new NotFoundError('Произошла ошибка: переданы некорректные данные'));
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка: переданы некорректные данные'));
      } else {
        next(err);
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
      next(new NotFoundError('Произошла ошибка: переданы некорректные данные'));
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка: переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
