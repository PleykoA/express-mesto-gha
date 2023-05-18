const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  changeAvatar,
} = require('../controllers/users');

const RegExp = (/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_[\]+.~#?&[\]/=]*)$/);

router.post('/', auth, createUser);
router.get('/', auth, getUsers);
router.get('/:userId', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().max(24).required(),
  }),
}), getUserById);

router.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

router.patch('/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(RegExp).required(),
  }),
}), changeAvatar);

module.exports = router;
