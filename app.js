const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const NotFoundError = require('./errors/NotFoundError');

const router = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'Ошибка на сервере' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
