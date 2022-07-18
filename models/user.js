const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { emailRegExp } = require('../utils/constants');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userShema = new mongoose.Schema({
  email: {
    type: String,
    reqiered: [true, 'Не заполнен email'],
    unique: [true, 'Пользователь с таким email уже есть'],
    lowcase: true,
    validate: {
      validator(val) {
        return emailRegExp.test(val);
      },
      message: 'email не соответвует формату',
    },
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Не заполнен пароль'],
    select: false,
  },
  name: {
    type: String,
    reqiered: [true, 'Не заполнено имя'],
    minlength: [2, 'Длина имени не должна быть меньше 2х символов'],
    maxlength: [30, 'Длина имени не должна быть больше 30ти символов'],
  },
});

userShema.statics.findUserByCredentials = function (res, next, email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        const err = new UnauthorizedError('неверные email или пароль');
        return next(err);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const err = new UnauthorizedError('неверные email или пароль');
            return next(err);
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userShema);
