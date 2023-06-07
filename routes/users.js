// const express = require('express');
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
// router.get('/', getCurrentUser);
router.get('/', createUser);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().custom(validateObjectId),
    }),
  }),
  getUser,

  router.patch(
    '/me',
    celebrate({
      body: Joi.object().keys({
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(30),
      }),
    }),
    updateUser,
  ),
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(
        /https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i,
      ),
    }),
  }),
  updateAvatar,
);

module.exports = router;
