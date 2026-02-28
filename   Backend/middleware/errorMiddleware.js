// Catches any request to a route that doesn't exist (404)
export const notFound = (req, res, next) => {
    const error = new Error(`Not Found: ${req.originalUrl}`);
    res.status(404);
    next(error); // Pass to global error handler below
  };
  
  // ─── errorHandler ─────────────────────────────────────────────────────────────
  // The global error handler. Express calls this whenever next(error) is called.
  // It sends a consistent JSON error response to the frontend.
  export const errorHandler = (err, req, res, next) => {
    // Sometimes a 200 status slips through with an error, default to 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
    res.status(statusCode).json({
      message: err.message,
      // Only show stack trace during development for debugging
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };