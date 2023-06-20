const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

// const rateLimit = require('express-rate-limit');

const router = require('./routes');
const { handleError } = require('./middlewares/handleError');

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

// app.use((req, res, next) => {
//   req.user = {
//     _id: '64822099eba3c0174009b682',
//   };

//   next();
// });

app.use(helmet());

app.use(cookieParser());

app.use(router);

app.use(errors()); // обработчик ошибок celebrate

app.use(handleError);
// здесь обрабатываем все ошибки
// app.use((err, req, res, next) => {
//   res.status(err.statusCode).send({ message: err.message });
// });

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App started on port ${PORT}`);
});
