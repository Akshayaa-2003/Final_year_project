const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
