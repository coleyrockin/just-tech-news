const isApiRequest = req =>
  req.originalUrl.startsWith('/api') || req.xhr || req.accepts(['html', 'json']) === 'json';

const asyncHandler = handler => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const httpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const resolveStatusCode = error => {
  if (error.statusCode || error.status) {
    return error.statusCode || error.status;
  }

  if (error.name === 'SequelizeValidationError') {
    return 400;
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return 409;
  }

  return 500;
};

const resolveMessage = (error, statusCode) => {
  if (statusCode >= 500) {
    return 'Internal server error.';
  }

  if (error.name === 'SequelizeValidationError' && error.errors?.length) {
    return error.errors.map(validationError => validationError.message).join(' ');
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return 'A record with that value already exists.';
  }

  return error.message;
};

const notFoundHandler = (req, res) => {
  if (isApiRequest(req)) {
    res.status(404).json({ message: 'Route not found.' });
    return;
  }

  res.status(404).send('Not found.');
};

const errorHandler = (error, req, res, _next) => {
  const statusCode = resolveStatusCode(error);
  const message = resolveMessage(error, statusCode);

  if (statusCode >= 500) {
    console.error(error);
  } else {
    console.warn(message);
  }

  if (isApiRequest(req)) {
    res.status(statusCode).json({ message });
    return;
  }

  res.status(statusCode).send(message);
};

module.exports = {
  asyncHandler,
  errorHandler,
  httpError,
  isApiRequest,
  notFoundHandler
};
