// const bcrypt = require('bcryptjs');
const { User } = require('../../models/user');
// const { ValidationError } = require('../../errors/ValidationError');
// const { NotFoundError } = require('../../errors/NotFoundError');

async function getAllUsers(req, res) {
  try {
    const users = await User.find({});
    // res.send(users);
    res.json(users);
  } catch (err) {
    // next(err);
    res.status(500).json(err);
  }
}

async function getUser(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      // throw new NotFoundError('Пользователь не найден');
      res.status(404).json({ message: 'Пользователь не найден' });
    }

    // res.send(user);
    res.json(user);
  } catch (err) {
    // if (err.name === 'CastError' || err.name === 'ValidationError') {
    //   next(new ValidationError(`Неверные данные в ${err.path ?? 'запросе'}`));
    //   return;
    // }
    // next(err);
    res.status(400).json(err);
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true },
    );

    if (!user) {
      // throw new NotFoundError('Пользователь не найден');
      res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (err) {
    // next(err);
    res.status(500).json({ message: 'Неверные данные' });
  }
}

async function updateAvatar(req, res) {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true },
    );

    if (!user) {
      // throw new NotFoundError('Пользователь не найден');
      res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.send(user);
  } catch (err) {
    // next(err);
    res.status(500).json({ message: 'Неверные данные' });
  }
}

async function createUser(req, res) {
  try {
    // Создаем нового пользователя на основе данных из запроса
    // const newUser = new User(req.body);
    // Сохраняем нового пользователя в базе данных
    // await newUser.save();
    // Отправляем статус 201 и сообщение об успешном создании пользователя
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.status(200).json(user);
  } catch (err) {
    // Если произошла ошибка, отправляем статус 500 и сообщение об ошибке
    // res.status(500).send('Ошибка при создании пользователя');
    res.status(500).json(err);
  }
}

module.exports = {
  getAllUsers, getUser, updateUser, updateAvatar, createUser,
};
