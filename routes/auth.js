const authRouter = require('express').Router();

const { login, createUser } = require('../controllers/auth');
const { validationLogin, validationCreateUser } = require('../middlewares/validation');

authRouter.post('/signin', validationLogin, login);
authRouter.post('/signup', validationCreateUser, createUser);

module.exports = authRouter;
