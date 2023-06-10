const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
      validate: {
        validator: (value) => validator.isAlpha(value),
        message: 'Некорректное имя карточки',
      },
    },
    link: {
      type: String,
      required: true,
      validate: /https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user',
        },
      ],
      default: [],
      minlength: 2,
      maxlength: 30,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);

const Card = mongoose.model('card', cardSchema);

module.exports = { Card };
