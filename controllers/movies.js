const Movie = require('../models/movie');
const { handleValidationError } = require('../utils/utils');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const ConflictError = require('../errors/ConflictError');
const { errorMessages } = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.makeMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.findOne({ movieId, owner: req.user._id })
    .then((movie) => {
      if (movie) {
        const error = new ConflictError(errorMessages.movieChoosen);
        next(error);
        return;
      }
      Movie.create({
        country,
        director,
        duration,
        year,
        description,
        image,
        trailerLink,
        nameRU,
        nameEN,
        thumbnail,
        movieId,
        owner: req.user._id,
      })
        .then((newmovie) => res.send(newmovie))
        .catch((err) => handleValidationError(err, next));
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(new NotFoundError(errorMessages.movieNotFound))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        const error = new ForbiddenError(errorMessages.movieNotToDelete);
        next(error);
        return;
      }
      Movie.findByIdAndRemove(req.params._id)
        .orFail(new NotFoundError(errorMessages.movieNotFound))
        .then((delmovie) => res.send(delmovie))
        .catch((err) => handleValidationError(err, next));
    })
    .catch(next);
};
