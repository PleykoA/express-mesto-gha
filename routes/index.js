const router = require('express').Router();
const routerCard = require('./cards');
const routerUser = require('./users');

router.use('/cards', routerCard);
router.use('/users', routerUser);

module.exports = router;