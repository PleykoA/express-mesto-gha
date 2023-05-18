const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { regex } = require('../app');
const AuthorizationError = require('../errors/AuthorizationError');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
    required: [true, 'Поле "name" должно быть заполнено'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля "about" - 2'],
    maxlength: [30, 'Максимальная длина поля "about" - 30'],
    required: [true, 'Поле "about" должно быть заполнено'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    minlength: [2, 'Минимальная длина поля "avatar" - 2'],
    required: [true, 'Поле "avatar" должно быть заполнено'],
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (value) => regex.test(value),
      message: 'Некорректный URL',
    },
  },
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: [true, 'Данный email уже используется'],
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorizationError('Произошла ошибка: введены неправильные данные'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorizationError('Произошла ошибка: введены неправильные данные'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
