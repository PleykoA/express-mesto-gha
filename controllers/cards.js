const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const { handleErrors } = require('../utils/handleErrors');

const getCards = (req, res) => {
  Card.find({})
    .populate([
      { path: 'likes', model: 'user' },
      { path: 'owner', model: 'user' },
    ])
    .then((cards) => res.send({ data: cards }))
    .catch((err) => handleErrors(err, res));
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
  const _id = req.params.cardId;

  Card.findOne({ _id })
    .populate([
      { path: 'owner', model: 'user' },
    ])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка уже удалена');
      }
      if (card.owner._id.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
      Card.findByIdAndDelete({ _id })
        .populate([
          { path: 'owner', model: 'user' },
        ])
        .then((deletedCard) => { res.send({ data: deletedCard }); });
    })
    .catch((err) => handleErrors(err, res));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate([
      { path: 'likes', model: 'user' },
      { path: 'owner', model: 'user' },
    ])
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch((err) => handleErrors(err, res));
};
const removeLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate([
      { path: 'likes', model: 'user' },
      { path: 'owner', model: 'user' },
    ])
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch((err) => handleErrors(err, res));
};
module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  removeLikeCard,
};
