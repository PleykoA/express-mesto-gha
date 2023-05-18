const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const auth = require('../middlewares/auth');

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  removeLikeCard,
} = require('../controllers/cards');

router.get('/', auth, getCards);
router.post('/', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_[\]+.~#?&[\]/=]*)$/).required(),
  }),
}), createCard);
router.delete('/:cardId', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteCard);
router.put('/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), likeCard);
router.delete('/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
}), removeLikeCard);

module.exports = router;
