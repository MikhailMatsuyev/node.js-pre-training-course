const express = require("express");
const crypto = require("crypto");

/**
 * Task 03: Centralized Error Handler
 * Routes throw errors, a single error-handling middleware formats
 * every response as { status, message, timestamp }.
 */

/**
 * Custom application error with an attached HTTP status code.
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    // TODO: Implement AppError
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Build and configure the Express app for this task.
 * @returns {import("express").Express}
 */
function createApp() {
  const app = express();

  app.get("/ok", (req, res) => {
    res.json({
      success: true,
      message: "Everything is fine",
    });
  });

  app.get("/error/sync", (req, res) => {
    // TODO: Synchronously throw a plain Error("Something went wrong")
    // Express 5 will automatically forward it to the error middleware below.
    throw new Error("Something went wrong");
  });

  app.get("/error/async", async (req, res) => {
    // TODO: In an async handler, throw Error("Async failure")
    // Express 5 automatically forwards rejected promises from async
    // handlers to the error middleware below.
    throw new Error("Async failure");
  });

  app.get("/error/custom", (req, res) => {
    // TODO: throw new AppError("Resource not found", 404)

    throw new AppError("Resource not found", 404);
  });

  // TODO: Register the centralized error-handling middleware LAST, after
  // all routes. It must have exactly four parameters: (err, req, res, next).
  //
  // Inside it:
  // 1. const status = err.statusCode || 500
  // 2. const message = err.message || "Internal Server Error"
  // 3. const timestamp = new Date().toISOString()
  // 4. res.status(status).json({ status, message, timestamp })
  //
  // app.use((err, req, res, next) => {
  //   ...
  // });
  app.use((req, res, next) => {
    req.requestId = crypto.randomUUID();
    next();
  });

  app.use((req, res, next) => {
    next(new AppError("Route not found", 404));
  });

  app.use((err, req, res, next) => {
    const status = err.statusCode || 500;

    if (err instanceof AppError) {
      console.error("[Operational Error]", err);

      return res.status(status).json({
        status,
        message: err.message,
        timestamp: new Date().toISOString(),
        requestId: req.requestId,
      });
    }

    console.error("[Programmer Error]", err);

    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    });
  });

  return app;
}

module.exports = { createApp, AppError };

// If this file is run directly, start the server
if (require.main === module) {
  const app = createApp();
  const port = process.env.PORT || 4003;
  app.listen(port, () => {
    console.log("=== Centralized Error Handler Server Started ===");
    console.log(`Server running on http://localhost:${port}`);
  });
}
