const cardRouter = require('express').Router();

const {
  createCardValidation,
  deleteCardValidation,
  likeCardValidation,
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
cardRouter.delete('/:cardId', deleteCardValidation, deleteCard);
cardRouter.put('/:cardId/likes', likeCardValidation, likeCard);
cardRouter.delete('/:cardId/likes', likeCardValidation, removeLikeCard);

module.exports = cardRouter;
