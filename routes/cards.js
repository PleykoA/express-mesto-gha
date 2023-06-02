const cardRouter = require('express').Router();

const {
  createCardValidation,
  cardValidation,
} = require('../utils/validation');
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  removeLikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post('/', createCardValidation, createCard);
cardRouter.delete('/:cardId', cardValidation, deleteCard);
cardRouter.put('/:cardId/likes', cardValidation, likeCard);
cardRouter.delete('/:cardId/likes', cardValidation, removeLikeCard);

module.exports = cardRouter;
