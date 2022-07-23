const BadRequestError = require('../errors/BadRequestError');
const InternalServerError = require('../errors/InternalServerError');
const { errorMessages } = require('./constants');

module.exports.handleError = (err, req, res, next) => {
  if (!err.statusCode) {
    const error = new InternalServerError(`Произошла ошибка: ${err.message}`);
    return next(res.status(error.statusCode).send({ message: error.message }));
  }
  return next(res.status(err.statusCode).send({ message: err.message }));
};

module.exports.handleValidationError = (err, next) => {
  if (err.name === 'ValidationError') {
    const error = new BadRequestError(errorMessages.badRequest);
    next(error);
  } else if (err.name === 'CastError') {
    const error = new BadRequestError(errorMessages.notFound);
    next(error);
  } else if (err.statusCode === 400) {
    const error = new BadRequestError(errorMessages.badRequest);
    next(error);
  } else {
    next(err);
  }
};
