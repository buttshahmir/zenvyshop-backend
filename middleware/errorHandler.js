// Global error handler — plug in at the bottom of server.js.
// Any route that calls next(error) or throws ends up here.
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong.';

  // Log full error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
