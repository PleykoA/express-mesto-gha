const router = require('express').Router();
const { celebrate } = require('celebrate');
const routerCard = require('./cards');
const routerUser = require('./users');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { signinValidation, signupValidation } = require('../utils/validation');

router.use(auth);
router.use('/cards', routerCard);
router.use('/users', routerUser);
router.post('/signin', celebrate(signinValidation), login);
router.post('/signup', celebrate(signupValidation), createUser);

module.exports = router;
