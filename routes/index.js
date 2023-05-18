const router = require('express').Router();
const routerCard = require('./cards');
const routerUser = require('./users');
const AuthorizationError = require('../errors/AuthorizationError');

router.use('/cards', routerCard);
router.use('/users', routerUser);
router.use('*', (req, res, next) => {
  next(new AuthorizationError('Произошла ошибка: страница не найдена'));
});

module.exports = router;
