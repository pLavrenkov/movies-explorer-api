const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/UnauthorizedError');
const { JWT_CODE } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { cookies } = req;
  if (!cookies) {
    const error = new UnauthorizedError('необходимо залогиниться');
    next(error);
    return;
  }
  const token = cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_CODE);
  } catch (err) {
    const error = new UnauthorizedError('необходимо залогиниться');
    next(error);
    return;
  }
  req.user = payload;
  req.credentials = 'include';
  next();
};
