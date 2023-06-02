const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const { handleErrors } = require('../utils/handleErrors');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user;

  Card.create({ name, link, owner })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => handleErrors(err, res));
};

const deleteCard = (req, res) => {
  const userId = req.user._id;

  Card.findById(req.params.id)
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== userId) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
      return Card.findByIdAndDelete(card._id);
    })
    .then((deletedCard) => res.status(200).send(deletedCard))
    .catch((err) => handleErrors(err, res));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((card) => res.send(card))
    .catch((err) => handleErrors(err, res));
};

const removeLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((card) => res.send(card))
    .catch((err) => handleErrors(err, res));
};
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  removeLikeCard,
};
