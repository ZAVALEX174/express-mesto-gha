// const express = require('express');
const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');

const ErrorNoteFound = 404;

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('*', (req, res) => {
  res.status(ErrorNoteFound).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
