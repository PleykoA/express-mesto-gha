const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');

const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');
const HandleErrors = require('./errors/HandleErrors');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const router = require('./routes');

const app = express();

const RegExp = (/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_[\]+.~#?&[\]/=]*)$/);

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(auth);
app.use(router);
app.use(errors());
app.use(HandleErrors);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(RegExp),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Произошла ошибка: страница не найдена'));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
