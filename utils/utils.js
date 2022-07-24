const BadRequestError = require('../errors/BadRequestError');
const InternalServerError = require('../errors/InternalServerError');
const { errorMessages } = require('./constants');

module.exports.handleError = (err, req, res, next) => {
  if (!err.statusCode || err.statusCode === 500) {
    const error = new InternalServerError(`Произошла ошибка: ${err.message}`);
    return next(error);
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
  } else {
    next(err);
  }
};
