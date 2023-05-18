const router = require('express').Router();
const routerCard = require('./cards');
const routerUser = require('./users');
const ForbiddenError = require('../errors/ForbiddenError');

router.use('/cards', routerCard);
router.use('/users', routerUser);
router.use('*', (req, res, next) => {
  next(new ForbiddenError('Произошла ошибка: страница не найдена'));
});

module.exports = router;
