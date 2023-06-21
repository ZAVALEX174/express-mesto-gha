// eslint-disable-next-line no-unused-vars
const express = require('express');
const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { login, createUser } = require('../controllers/users/users');
const { auth } = require('../middlewares/auth');
const { urlRegex } = require('../utils/urlRegex');
const { NotFoundError } = require('../errors/NotFoundError');
const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(urlRegex),
    }),
  }),
  createUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Неверный адрес запроса'));
});

module.exports = router;
