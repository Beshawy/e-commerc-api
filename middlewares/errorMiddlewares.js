const ApiError = require('../utils/apiError');

const handleJwtError = (err) => {
  if (err.name === 'JsonWebTokenError') {
    return new ApiError('Invalid token, please login again', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return new ApiError('Your token has expired, please login again', 401);
  }
  return err;
};

const sendErrorForDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  console.error('ERROR 💥:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorForDev(err, res);
  } else {
    // production: transform known errors into operational ones
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      error = handleJwtError(err);
    }

    sendErrorForProd(error, res);
  }
};

module.exports = globalError;