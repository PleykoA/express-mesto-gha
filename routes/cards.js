const cardRouter = require('express').Router();
const { celebrate } = require('celebrate');
const auth = require('../middlewares/auth');

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
cardRouter.post('/', celebrate(createCardValidation), createCard);

cardRouter.delete(
  '/:cardId',
  celebrate(deleteCardValidation),
  auth,
  deleteCard,
);

cardRouter.put('/:cardId/likes', celebrate(likeCardValidation), likeCard);
cardRouter.delete(
  '/:cardId/likes',
  celebrate(likeCardValidation),
  removeLikeCard,
);

module.exports = cardRouter;
