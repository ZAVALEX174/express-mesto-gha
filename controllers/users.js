// eslint-disable-next-line import/no-extraneous-dependencies
// const validator = require('validator');
// const User = require('../models/user');

// const getUsers = (req, res) => {
//   User.find({})
//     .then((user) => { res.send({ data: user }); })
//     .catch((err) => { res.status(500).send({ message: `Произошла ошибка ${err}` }); });
// };

// const getUserById = (req, res) => {
//   if (validator.isMongoId(req.params.userId)) {
//     User.findById(req.params.userId)
//       .then((user) => {
//         if (user) { res.status(200).send({ data: user }); } else {
//           res.status(404).send({
//             message: 'Нет пользователя с таким id',
//           });
//         }
//       })
//       .catch((err) => { res.status(500).send({ message: `Произошла ошибка ${err}` }); });
//   } else {
//     res.status(400).send({
//       message: 'Нет пользователя с таким id',
//     });
//   }
// };

// const createUser = (req, res) => {
//   const { name, about, avatar } = req.body;
//   User.create({ name, about, avatar })
//     .then((user) => { res.status(201).send({ data: user }); })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         res.status(400).send({ message: `${err}` });
//       } else { res.status(500).send({ message: `Произошла ошибка ${err}` }); }
//     });
// };

// const updateUser = (req, res) => {
//   User.findByIdAndUpdate(req.user._id, {
//     name: req.body.name,
//     about: req.body.about,
//     avatar: req.body.avatar,
//   })
//     .then((user) => { res.send(user); })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         res.status(400).send({ message: `${err}` });
//       } else { res.status(500).send({ message: `Произошла ошибка ${err}` }); }
//     });
// };

// const updateAvatar = (req, res) => {
//   User.findByIdAndUpdate(req.user._id, {
//     avatar: req.body.avatar,
//   })
//     .then((user) => { res.send({ data: user }); })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         res.status(400).send({ message: `${err}` });
//       } else { res.status(500).send({ message: `Произошла ошибка ${err}` }); }
//     });
// };

// module.exports = {
//   getUsers,
//   getUserById,
//   createUser,
//   updateUser,
//   updateAvatar,
// };

// const bcrypt = require('bcryptjs');
const User = require('../models/user');
// const ConflictError = require('../utils/errors/errors/ConflictError');
const ValidationError = require('../utils/errors/errors/ValidationError');
const NotFoundError = require('../utils/errors/errors/NotFoundError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((next));
};

const getUserById = (req, res, next) => {
  // const userId = req.params.userId ? req.params.userId : req.user._id;
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(
          'Пользователь по указанному id не найден.',
        );
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      // if (err.path === 'ObjectId') {
      if (err.path === '_id' || err.name === 'CastError') {
        next(new ValidationError('Некорректный формат id.'));
      } else {
        next(err);
      }
    });
};

// const createUser = (req, res, next) => {
//   const { name, about, avatar } = req.body;

//   User.findOne(User.create)
//     .then((userSaved) => {
//       if (!userSaved) {
//         throw new NotFoundError(
//           'Пользователь по указанному id не найден.',
//         );
//       }
//       return res.send({
//         data:
//           name: user.name,
//         about: user.about,
//         avatar: user.avatar,
//         _id: user._id,
//       });
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new ValidationError('Переданы некорректные данные при создании пользователя.'));
//       } else {
//         next(err);
//       }
//     });
// };

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => { res.status(201).send({ data: user }); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `${err}` });
      } else { res.status(500).send({ message: `Произошла ошибка ${err}` }); }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })

    .then((user) => {
      if (!user) {
        throw new NotFoundError(
          'Пользователь по указанному id не найден.',
        );
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при обновлении профиля.'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(
          'Пользователь по указанному id не найден.',
        );
      }

      res.send({ data: user });
    })
    .catch(next);
};

module.exports = {
  getUsers, getUserById, createUser, updateUser, updateAvatar,
};
