const { celebrate, Joi } = require('celebrate');
const isUrl = require('validator/lib/isURL');
const BadRequest = require('../errors/BadRequestError');

const validationUrl = (url) => {
  const validate = isUrl(url);
  if (validate) {
    return url;
  }
  throw new BadRequest('Некорректный URL');
};

const validationID = (id) => {
  if (/^[0-9a-fA-F]{24}$/.test(id)) {
    return id;
  }
  throw new BadRequest('Некорректный id');
};
// signinValidation
const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
// signupValidation
const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validationUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
// editProfileValidation
const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});
// updateAvatarValidation
const validationUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validationUrl),
  }),
});

const validationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().custom(validationID),
  }),
});
// createCardValidation
const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom(validationUrl),
  }),
});
// delete/like card?
const validationCardById = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(validationID),
  }),
});

/* const deleteCardValidation = celebrate({
  params: Joi.object({
    cardId: Joi.string().hex().length(24),
  }),
});

const likeCardValidation = celebrate({
  params: Joi.object({
    cardId: Joi.string().hex().length(24),
  }),
}); */

module.exports = {
/*   likeCardValidation,
  deleteCardValidation, */
  validationCardById,
  validationCreateCard,
  validationUserId,
  validationUpdateAvatar,
  validationUpdateUser,
  validationCreateUser,
  validationLogin,
};
