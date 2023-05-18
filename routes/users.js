const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { RegExp } = require('../app');

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  changeAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(RegExp).required(),
  }),
}), changeAvatar);

module.exports = router;
