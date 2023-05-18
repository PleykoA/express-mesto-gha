const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

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
    avatar: Joi.string().regex(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_[\]+.~#?&[\]/=]*)$/).required(),
  }),
}), changeAvatar);

module.exports = router;
