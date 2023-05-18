const router = require('express').Router();
const routerCard = require('./cards');
const routerUser = require('./users');
const NotFoundError = require('../errors/NotFoundError');

router.use('/cards', routerCard);
router.use('/users', routerUser);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Произошла ошибка: страница не найдена'));
});

module.exports = router;
