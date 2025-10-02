const ErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.isOperational ? err.message : "Somethings went wrong";
  console.error(err);
  res.status(statusCode).json({
    statusCode,
    success: false,
    message: message || err, // sadece temiz mesaj döner
  });
};

export default ErrorHandler;
