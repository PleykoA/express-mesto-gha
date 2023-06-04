const router = require('express').Router();

const {
  createCardValidation,
  deleteCardValidation,
  likeCardValidation,
} = require('../utils/validation');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  removeLikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCardValidation, createCard);
router.delete('/:cardId', deleteCardValidation, deleteCard);
router.put('/:cardId/likes', likeCardValidation, likeCard);
router.delete('/:cardId/likes', likeCardValidation, removeLikeCard);

module.exports = router;
