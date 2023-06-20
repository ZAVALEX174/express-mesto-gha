const express = require('express');
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

// function auth(req, res, next) {
//   try {
//     const { authorization } = req.headers;

//     if (!authorization || !authorization.startsWith('Bearer ')) {
//       throw new UnauthorizedError(
//         'Для выполн!ения действия необходима авторизация',
//       );
//     }

//     const token = authorization.replace('Bearer ', '');
//     let payload;

//     try {
//       payload = jwt.verify(token, 'secretkey');
//     } catch (err) {
//       throw new UnauthorizedError(
//         'Для выполнения действия необходима авторизация',
//       );
//     }

//     req.user = payload;
//     next();
//   } catch (err) {
//     next(err);
//   }
// }

// module.exports = { auth };

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  // console.log(token);
  let payload;

  try {
    payload = jwt.verify(token, 'secretkey');
  } catch (err) {
    const error = new UnauthorizedError('Необходима авторизация');
    err.statusCode = 401;
    next(error);
  }

  req.user = payload;
  next();
};

module.exports = { auth };
