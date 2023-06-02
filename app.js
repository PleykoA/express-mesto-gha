const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const NotFoundError = require('./errors/NotFoundError');

const auth = require('./middlewares/auth');

const app = express();
app.use(bodyParser.json());

const { validationCreateUser, validationLogin } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;
const { createUsers, login } = require('./controllers/auth');

app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUsers);
app.use(auth);
app.use(router);

async function connect() {
  try {
    await mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://localhost:27017/mestodb');
    await app.listen(PORT);
    console.log(`App listening on port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
}
app.use(errorLogger);
app.use(errors());

app.use('*', (req, res) => {
  res.status(new NotFoundError('Такой страницы не существует'));
});
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

connect()
  .then(() => console.log('MongoDB connected'));
