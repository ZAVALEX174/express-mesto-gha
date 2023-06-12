const { User } = require('../../models/user');

async function getAllUsers(req, res) {
  const SERVER_ERROR = 500;
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(SERVER_ERROR).json({ message: 'Ошибка на стороне сервера' });
  }
}

async function getUser(req, res) {
  const SERVER_ERROR = 500;
  const VALIDATION_ERROR = 400;
  const NOT_FOUND_ERROR = 404;
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      res.status(NOT_FOUND_ERROR).json({ message: 'Пользователь не найден' });
    } else {
      res.json(user);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(VALIDATION_ERROR).json({ message: 'Неверные данные' });
    } else {
      res.status(SERVER_ERROR).json({ message: 'Ошибка на стороне сервера' });
    }
  }
}

async function updateUser(req, res) {
  const SERVER_ERROR = 500;
  const VALIDATION_ERROR = 400;
  const NOT_FOUND_ERROR = 404;
  try {
    const error = ('Пользователь по данному id отсутствуе в базе');
    error.statusCode = 404;
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      res.status(NOT_FOUND_ERROR).json({ message: 'указан не существующий id' });
    } else {
      res.json(user);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(VALIDATION_ERROR).json({ message: 'Неверные данные' });
    } else {
      res.status(SERVER_ERROR).json({ message: 'Ошибка на стороне сервера' });
    }
  }
}

async function updateAvatar(req, res) {
  const SERVER_ERROR = 500;
  const VALIDATION_ERROR = 400;
  const NOT_FOUND_ERROR = 404;
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true },
    );

    if (!user) {
      res.status(NOT_FOUND_ERROR).json({ message: 'указан не существующий id' });
    } else {
      res.json(user);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(VALIDATION_ERROR).json({ message: 'Неверные данные' });
    } else {
      res.status(SERVER_ERROR).json({ message: 'Ошибка на стороне сервера' });
    }
  }
}

async function createUser(req, res) {
  const SERVER_ERROR = 500;
  const VALIDATION_ERROR = 400;
  const OK = 201;
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.status(OK).json(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(VALIDATION_ERROR).json({ message: 'Неверные данные' });
    } else {
      res.status(SERVER_ERROR).json({ message: 'Ошибка на стороне сервера' });
    }
  }
}

module.exports = {
  getAllUsers, getUser, updateUser, updateAvatar, createUser,
};
