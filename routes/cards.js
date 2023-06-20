// const express = require('express');
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validateObjectId } = require('../utils/validateObjectId');

const {
  getAllCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards/cards');

const paramsValidationConfig = {
  params: Joi.object().keys({
    cardId: Joi.string().custom(validateObjectId),
  }),
};

router.get('/', getAllCards);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .regex(/^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/),
    }),
  }),
  createCard,
);

router.delete('/:cardId', celebrate(paramsValidationConfig), deleteCard);

router.put('/:cardId/likes', celebrate(paramsValidationConfig), putLike);

router.delete('/:cardId/likes', celebrate(paramsValidationConfig), deleteLike);

module.exports = router;
