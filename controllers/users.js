// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');
const User = require('../models/user');
const {
  ERROR_CODE,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER_ERROR,
} = require('../utils/errors/error');

// const getUsers = async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.status(200).send({ data: user });
//   } catch (err) {
//     res.status(500).send({
//       message: "Internal Server Error",
//       err: err.message,
//       stack: err.stack,
//     });
//   }
// };

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch((err) => res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err}` }));
};

const getUserById = (req, res) => {
  if (validator.isMongoId(req.params.userId)) {
    User.findById(req.params.userId)
      .then((user) => {
        if (user) res.status(200).send(user);
        else {
          res.status(ERROR_NOT_FOUND).send({
            message: 'Нет пользователя с таким id',
          });
        }
      })
      .catch((err) => res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err}` }));
  } else {
    res.status(ERROR_NOT_FOUND).send({
      message: 'Нет пользователя с таким id',
    });
  }
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(ERROR_CODE).send({ message: `${err}` });
      else res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err}` });
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(ERROR_CODE).send({ message: `${err}` });
      else res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err}` });
    });
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') res.status(ERROR_CODE).send({ message: `${err}` });
      else res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err}` });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
