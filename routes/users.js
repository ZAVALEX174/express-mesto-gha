/* eslint-disable no-unused-vars */
const express = require('express');
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlRegex } = require('../utils/urlRegex');

const { validateObjectId } = require('../utils/validateObjectId');

const {
  getAllUsers,
  getUser,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users/users');

router.get('/', getAllUsers);
router.get('/me', getCurrentUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().custom(validateObjectId),
  }),
}), getUser);

router.patch('/me', celebrate({ body: Joi.object().keys({ name: Joi.string().min(2).max(30), about: Joi.string().min(2).max(30) }) }), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(urlRegex),
  }),
}), updateAvatar);

module.exports = router;
