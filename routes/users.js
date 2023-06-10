const express = require('express');
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { validateObjectId } = require('../utils/validateObjectId');

const {
  getAllUsers,
  getUser,
  updateUser,
  updateAvatar,
  createUser,
} = require('../controllers/users/users');

router.get('/', getAllUsers);

router.post('/', createUser);

router.get('/:userId', getUser);

router.patch('/me', celebrate({ body: Joi.object().keys({ name: Joi.string().min(2).max(30), about: Joi.string().min(2).max(30) }) }), updateUser);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
