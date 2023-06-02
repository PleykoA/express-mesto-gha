const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');
const authRouter = require('./routes/auth');
const router = require('./routes');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to database');
}).catch((error) => {
  console.error('Error connecting to database:', error);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors);

app.use(authRouter);
app.use(auth);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(requestLogger);

app.use('*', (req, res) => {
  res.status(new NotFoundError('Такой страницы не существует'));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });

  next();
});

app.listen(PORT);
