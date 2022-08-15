const mongoose = require('mongoose');
const { urlRegExp } = require('../utils/constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'не указана страна создания фильма'],
  },
  director: {
    type: String,
    required: [true, 'не указан режиссер фильма'],
  },
  duration: {
    type: Number,
    required: [true, 'не указан длительность фильма'],
  },
  year: {
    type: String,
    required: [true, 'не указан год выпуска фильма'],
  },
  description: {
    type: String,
    required: [true, 'отсутствует описание фильма'],
  },
  image: {
    type: String,
    required: [true, 'не указан постер к фильму'],
    validate: {
      validator(val) {
        return urlRegExp.test(val);
      },
      message: 'ссылка на постер к фильму введна некорректно',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'не указан трейлер к фильму'],
    validate: {
      validator(val) {
        return urlRegExp.test(val);
      },
      message: 'ссылка на постер к фильму введна некорректно',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'не указан сжатый постер к фильму'],
    validate: {
      validator(val) {
        return urlRegExp.test(val);
      },
      message: 'ссылка на постер к фильму введна некорректно',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'отсутствует id пользователя, сохранившего фильм'],
  },
  movieId: {
    type: Number,
    required: [true, 'отсутствует id фильма на сервисе MoviesExplorer'],
  },
  nameRU: {
    type: String,
    required: [true, 'отсутствует название фильма на русском языке'],
  },
  nameEN: {
    type: String,
    required: [true, 'отсутствует название фильма на английском языке'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('movie', movieSchema);
