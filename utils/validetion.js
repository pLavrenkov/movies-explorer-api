const { celebrate, Joi } = require('celebrate');
const { urlRegExp } = require('./constants');

module.exports.validateUserCreate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.validateUserUpdate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string().min(2).max(30),
  }),
});

module.exports.validateMovieMake = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(true),
    director: Joi.string().required(true),
    duration: Joi.number().required(true),
    year: Joi.string().required(true),
    description: Joi.string().required(true),
    image: Joi.string().pattern(urlRegExp).required(true),
    trailerLink: Joi.string().pattern(urlRegExp).required(true),
    nameRU: Joi.string().required(true),
    nameEN: Joi.string().required(true),
    thumbnail: Joi.string().pattern(urlRegExp).required(true),
    movieId: Joi.number().required(true),
    owner: Joi.string().length(24).hex(),
  }),
});

module.exports.validateMovieId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
});
