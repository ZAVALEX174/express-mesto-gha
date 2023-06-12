const { Card } = require('../../models/card');
const {
  NOT_FOUND_ERROR, VALIDATION_ERROR, SERVER_ERROR, OK,
} = require('../../CodeStatus/CodeStatus');

async function getAllCards(req, res) {
  try {
    const cards = await Card.find({});
    res.json(cards);
  } catch (err) {
    res.status(SERVER_ERROR).json({ message: 'Ошибка на стороне сервера' });
  }
}

async function createCard(req, res) {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    res.status(OK).json(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(VALIDATION_ERROR).json({ message: 'Неверные данные' });
    } else {
      res.status(SERVER_ERROR).json({ message: 'Ошибка на стороне сервера' });
    }
  }
}

async function deleteCard(req, res) {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId);
    if (!card) {
      res.status(NOT_FOUND_ERROR).json({ message: 'указан не существующий id' });
    } else {
      res.json(card);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(VALIDATION_ERROR).json({ message: 'Неверные данные' });
    } else {
      res.status(SERVER_ERROR).json({ message: 'Ошибка на стороне сервера' });
    }
  }
}

async function putLike(req, res) {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } },
      { new: true, runValidators: true },
    );
    if (!card) {
      res.status(NOT_FOUND_ERROR).json({ message: 'указан не существующий id' });
    } else {
      res.json(card);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(VALIDATION_ERROR).json({ message: 'Неверные данные' });
    } else {
      res.status(SERVER_ERROR).json({ message: 'Ошибка на стороне сервера' });
    }
  }
}

async function deleteLike(req, res) {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true, runValidators: true },
    );
    if (!card) {
      res.status(NOT_FOUND_ERROR).json({ message: 'указан не существующий id' });
    } else {
      res.json(card);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(VALIDATION_ERROR).json({ message: 'Неверные данные' });
    } else {
      res.status(SERVER_ERROR).json({ message: 'Ошибка на стороне сервера' });
    }
  }
}

module.exports = {
  createCard, deleteCard, getAllCards, putLike, deleteLike,
};
