const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { JWT_CODE, COOKIES_SECURE } = require('../utils/constants');
const { handleValidationError } = require('../utils/utils');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('пользователь не найден или удален'))
    .then((user) => res.send(user))
    .catch((err) => handleValidationError(err, next));
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        const error = new ConflictError('пользователь с таким email уже существует');
        next(error);
        return;
      }
      bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({ email, password: hash, name })
            .then((newUser) => res.status(201).send({
              _id: newUser._id,
              email: newUser.email,
              name: newUser.name,
            }))
            .catch((err) => handleValidationError(err, next));
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { password } = req.body;
  if (!req.body.email || !req.body.password) {
    const error = new BadRequestError('не заполнены email или пароль');
    next(error);
    return;
  }
  const email = req.body.email.toLowerCase();
  if (!validator.isEmail(email)) {
    const error = new BadRequestError('email введен некорректно');
    next(error);
    return;
  }
  User.findUserByCredentials(res, next, email, password)
    .then((user) => {
      if (user) {
        const token = jwt.sign({ _id: user._id }, JWT_CODE, { expiresIn: '7d' });
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'None',
          secure: COOKIES_SECURE,
        })
          .status(200).send({
            _id: user._id,
            email: user.email,
            name: user.name,
          });
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => handleValidationError(err, next));
};

module.exports.logout = (req, res, next) => {
  const { cookies } = req;
  if (!cookies || !cookies.jwt) {
    const err = new UnauthorizedError('необходимо залогиниться');
    next(err);
    return;
  }
  res.clearCookie('jwt').status(200).send({ message: 'пользователь вышел' });
};
