const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const { authRouter } = require('./routes/index');
const auth = require('./middlewares/auth');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const router = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(requestLogger);
app.use(auth);
app.use(authRouter);
app.use(router);
app.use(errorLogger);
app.use(errors());

app.use((req, res) => {
  res.status(404).send({
    message: 'Запрошен несуществующий роут',
  });
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });

  next();
});

app.listen(PORT);
