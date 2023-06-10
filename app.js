const express = require('express');
const mongoose = require('mongoose');
// const { errors } = require('celebrate');

const router = require('./routes');
// const { handleError } = require('./middlewares/handleError');

const { PORT = 3000 } = process.env;
const DATABASE_URL = 'mongodb://127.0.0.1:27017/mestodb';

const app = express();
app.use(express.json());

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    // console.log(`Connected to database on ${DATABASE_URL}`);
  })
  // eslint-disable-next-line no-unused-vars
  .catch((err) => {
    // console.log('Error on database connection');
    // console.error(err);
  });

app.use((req, res, next) => {
  req.user = {
    _id: '64822099eba3c0174009b682', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(router);

// app.use(errors()); // обработчик ошибок celebrate

// app.use(handleError);

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
