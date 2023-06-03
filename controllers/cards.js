/* eslint-disable no-undef */
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');
const Card = require('../models/card');
const {
  ERROR_CODE,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER_ERROR,
} = require('../utils/errors/error');

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err}` }));
};

const deleteCard = (req, res) => {
  // eslint-disable-next-line no-undef
  Card.findOneAndRemove(req.params.cardId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'Internal Server Error') {
        res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err}` });
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Нет карточки с таким id' });
      }
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: `${err}` });
      } else { res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err}` }); }
    });
};

const likeCard = (req, res) => {
  if (req.params.cardId && validator.isMongoId(req.params.cardId)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    ).then((card) => res.send({ data: card }))
      .catch((err) => res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err}` }));
  } else res.status(ERROR_NOT_FOUND).send({ message: 'Нет карточки с таким id' });
};

const dislikeCard = (req, res) => {
  if (req.params.cardId && validator.isMongoId(req.params.cardId)) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    ).then((card) => res.send({ data: card }))
      .catch((err) => res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err}` }));
  } else res.status(ERROR_NOT_FOUND).send({ message: 'Нет карточки с таким id' });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
