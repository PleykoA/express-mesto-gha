const router = require('express').Router();
const { celebrate } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  createCardValidation,
  deleteCardValidation,
  likeCardValidation,
} = require('../middlewares/validation');
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  removeLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate(createCardValidation), createCard);

router.delete(
  '/:cardId',
  celebrate(deleteCardValidation),
  auth,
  deleteCard,
);

router.put('/:cardId/likes', celebrate(likeCardValidation), likeCard);
router.delete(
  '/:cardId/likes',
  celebrate(likeCardValidation),
  removeLikeCard,
);

module.exports = router;
