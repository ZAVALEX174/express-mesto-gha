const { error } = require('winston');
const { Card } = require('../../models/card');
const { ValidationError } = require('../../errors/ValidationError');
const { NotFoundError } = require('../../errors/NotFoundError');
// const e = require('express');
const { ForbiddenError } = require('../../errors/ForbiddenError');

async function getAllCards(req, res) {
  try {
    const cards = await Card.find({});
    // res.send(cards);
    res.json(cards);
  } catch (err) {
    // next(err);
    res.status(500).json(err);
  }
}

async function createCard(req, res) {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    res.status(201).json(card);
  } catch (err) {
    // if (err.name === 'CastError' || err.name === 'ValidationError') {
    //   next(new ValidationError(`Неверные данные в ${err.path ?? 'запросе'}`));
    res.status(500).json(err);
  }
}

async function deleteCard(req, res) {
  try {
    const { cardId } = req.params;

    // const card = await Card.findById(cardId).populate('owner');

    if (!cardId) {
      res.status(400).json({ message: 'id не указан' });
    }

    // const ownerId = card.owner.id;
    // const userId = req.user._id;

    // if (ownerId !== userId) {
    //   throw new ForbiddenError('Нельзя удалить чужую карточку');
    // }

    // await Card.findByIdAndRemove(cardId);

    // res.send(card);
    const card = await Card.findByIdAndDelete(cardId);
    res.json(card);
  } catch (err) {
    res.status(500).json(err);
  }
}

async function putLike(req, res, next) {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } }, // добавить _id в массив, если его там нет
      { new: true },
    );

    // if (!card) {
    //   throw new NotFoundError('Карточка не найдена');
    // }

    res.send(card);
  } catch (err) {
    // if (err.name === 'CastError' || err.name === 'ValidationError') {
    //   next(new ValidationError(`Неверные данные в ${err.path ?? 'запросе'}`));
    //   return;
    res.status(500).json(err);
  }
  // next(err);
  next(error);
}

async function deleteLike(req, res, next) {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } }, // убрать _id из массива, если он есть
      { new: true },
    );

    // if (!card) {
    //   throw new NotFoundError('Карточка не найдена');
    // }

    res.send(card);
  } catch (err) {
    // if (err.name === 'CastError' || err.name === 'ValidationError') {
    //   next(new ValidationError(`Неверные данные в ${err.path ?? 'запросе'}`));
    //   return;
    res.status(500).json(err);
  }
  next(error);
}

module.exports = {
  createCard,
  deleteCard,
  getAllCards,
  putLike,
  deleteLike,
};
