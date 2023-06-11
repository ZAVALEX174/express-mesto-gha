// const bcrypt = require('bcryptjs');
const { User } = require('../../models/user');
const { ValidationError } = require('../../errors/ValidationError');
const { NotFoundError } = require('../../errors/NotFoundError');
const { ServerError } = require('../../errors/ServerError');

async function getAllUsers(req, res) {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    throw new ServerError('ошибка сервера');
    // res.status(500).json(err);
  }
}

async function getUser(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
      // res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (err) {
    throw new ValidationError('Пользователь не найден');
    // res.status(400).json(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true },
    );

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function updateAvatar(req, res, next) {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true },
    );

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res) {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.status(200).json(user);
  } catch (err) {
    throw new ValidationError('Пользователь не найден');
    // res.status(400).json(err);
  }
}

module.exports = {
  getAllUsers, getUser, updateUser, updateAvatar, createUser,
};
