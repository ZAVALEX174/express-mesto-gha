const User = require("../models/user");

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
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) =>
      res.status(500).send({
        message: "Internal Server Error",
        err: err.message,
        stack: err.stack,
      })
    );
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error("Not found"))
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === "Not found") {
        res.status(404).send({
          message: "User not found",
        });
      } else {
        res.status(500).send({
          message: "Internal Server Error",
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) =>
      res.status(500).send({
        message: "Internal Server Error",
        err: err.message,
        stack: err.stack,
      })
    );
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(500).send({
        message: "Internal Server Error",
        err: err.message,
        stack: err.stack,
      })
    );
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    avatar: req.body.avatar,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(500).send({
        message: "Internal Server Error",
        err: err.message,
        stack: err.stack,
      })
    );
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
