const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const {
  ERROR_NOT_FOUND,
} = require('../utils/errors/error');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
