const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../models/user');
const { ConflictError } = require('../../errors/ConflictError');
const { ValidationError } = require('../../errors/ValidationError');
const { UnauthorizedError } = require('../../errors/UnauthorizedError');
const { NotFoundError } = require('../../errors/NotFoundError');

async function getAllUsers(req, res, next) {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new ValidationError(`Неверные данные в ${err.path ?? 'запросе'}`));
      return;
    }
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.send(user);
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

const SALT_LENGTH = 10;

async function createUser(req, res, next) {
  try {
    const {
      email, password, name, about, avatar,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, SALT_LENGTH);

    let user = await User.create({
      email,
      password: passwordHash,
      name,
      about,
      avatar,
    });

    user = user.toObject();
    delete user.password;
    res.status(201).send(user);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new ValidationError(`Неверные данные в ${err.path ?? 'запросе'}`));
      return;
    }
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с таким email уже существует'));
      return;
    }

    next(err);
  }
}

async function login(req, res, next) {
  try {
    // вытащить email и password
    const { email, password } = req.body;

    // проверить существует ли пользователь с таким email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Неверные данные для входа');
      // res.status(VALIDATION_ERROR).json({ message: 'Неверные данные' });
    }
    // проверить совпадает ли пароль
    const hasRightPassword = await bcrypt.compare(password, user.password);

    if (!hasRightPassword) {
      throw new UnauthorizedError(' Неверные данные для входа');
      // res.status(VALIDATION_ERROR).json({ message: 'Неверные данные' });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secretkey',
    );

    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: true,
    })
      .send({ message: 'Успешная авторизация.' });
    // если совпадает - вернуть пользователя
    // если нет - вернуть ошибку
  } catch (err) {
    next(err);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllUsers, getUser, updateUser, updateAvatar, createUser, login, getCurrentUser,
};
