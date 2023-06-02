const { celebrate, Joi } = require('celebrate');
const isUrl = require('validator/lib/isURL');
const BadRequest = require('../errors/BadRequestError');
const { RegExp } = require('./utils');

const validationUrl = (url) => {
  const validate = isUrl(url);
  if (validate) {
    return url;
  }
  throw new BadRequest('Некорректный URL');
};

const signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const signupValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(RegExp),
  }),
});

const getUserByIdValidation = celebrate({
  params: Joi.object({
    userId: Joi.string().hex().length(24),
  }),
});

const editProfileValidation = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const updateAvatarValidation = celebrate({
  body: Joi.object({
    avatar: Joi.string().pattern(RegExp),
  }),
});

const createCardValidation = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom(validationUrl),
  }),
});

const deleteCardValidation = celebrate({
  params: Joi.object({
    cardId: Joi.string().hex().length(24),
  }),
});

const likeCardValidation = celebrate({
  params: Joi.object({
    cardId: Joi.string().hex().length(24),
  }),
});

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
