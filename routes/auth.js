const authRouter = require('express').Router();

const { login, createUser } = require('../controllers/users');
const { signinValidation, signupValidation } = require('../utils/validation');

authRouter.post('/signin', signinValidation, login);
authRouter.post('/signup', signupValidation, createUser);

module.exports = authRouter;
