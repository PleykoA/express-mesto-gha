const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const error = require('./middlewares/error');
const auth = require('./middlewares/auth');

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

const { validationCreateUser, validationLogin } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;
const { createUser, login, logout } = require('./controllers/users');

app.get('/signout', logout);
app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);
app.use(auth);

app.use(router);

app.use(errorLogger);
app.use(requestLogger);
app.use(errors());
app.use(error);

async function connect() {
  try {
    await mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => {
      // eslint-disable-next-line no-console
      console.log('Connected to database');
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error connecting to database:', err);
    });
    await app.listen(PORT);
    // eslint-disable-next-line no-console
    console.log(`App listening on port ${PORT}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

connect()
  // eslint-disable-next-line no-console
  .then(() => console.log('MongoDB connected'));
