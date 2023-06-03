const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '647a0f209c94eb5985ada853', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(router);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${PORT}`);
});
