// const express = require('express');
const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');

const { NotFoundError } = require('../errors/NotFoundError');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('*', (req, res) => {
  res.status(NotFoundError).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
