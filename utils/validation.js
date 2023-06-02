const { Joi } = require('celebrate');
const { RegExp } = require('./utils');

const signinValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
};

const signupValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(RegExp),
  }),
};

const getUserByIdValidation = {
  params: Joi.object({
    userId: Joi.string().hex().length(24),
  }),
};

const editProfileValidation = {
  body: Joi.object({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
};

const updateAvatarValidation = {
  body: Joi.object({
    avatar: Joi.string().pattern(RegExp),
  }),
};

const createCardValidation = {
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(RegExp).required(),
  }),
};

const deleteCardValidation = {
  params: Joi.object({
    cardId: Joi.string().hex().length(24),
  }),
};

const likeCardValidation = {
  params: Joi.object({
    cardId: Joi.string().hex().length(24),
  }),
};

module.exports = {
  getUserByIdValidation,
  editProfileValidation,
  updateAvatarValidation,
  signinValidation,
  signupValidation,
  createCardValidation,
  deleteCardValidation,
  likeCardValidation,
};
