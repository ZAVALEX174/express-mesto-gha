const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'secretkey');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
    // next(err);
  }

  req.user = payload;
  next();
};

module.exports = { auth };
