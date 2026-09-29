function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Something went wrong. Please try again later.'
  });
}
module.exports = errorHandler;
