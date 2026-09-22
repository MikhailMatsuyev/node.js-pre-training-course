const express = require("express");

/**
 * Task 01: Middleware Playground
 * Chain a logger, a timer, and a header-injector middleware together and
 * expose the execution order they ran in.
 */

/**
 * Logger middleware
 * Logs method, path, and timestamp for every request.
 */
function logger(req, res, next) {
  if (!req.executionLog) {
    req.executionLog = [];
  }

  console.log(
      `[LOGGER] ${req.method} ${req.path} - ${new Date().toISOString()}`
  );

  req.executionLog.push("logger");

  next();
}

/**
 * Timer middleware
 * Records how long the request took to process.
 */
function timer(req, res, next) {
  req.startTime = Date.now();

  req.executionLog.push("timer");

  res.on("finish", () => {
    const elapsed = Date.now() - req.startTime;

    console.log(`[TIMER] ${req.method} ${req.path} took ${elapsed}ms`);
  });

  next();
}

/**
 * Header injector middleware
 * Adds a custom response header to every response.
 */
function headerInjector(req, res, next) {
  res.set("X-Powered-By-Course", "node-express-nest");

  req.executionLog.push("headerInjector");

  next();
}

/**
 * Build and configure the Express app for this task.
 * Does not call listen() so it can be reused by tests.
 * @returns {import("express").Express}
 */
function createApp() {
  const app = express();

  app.use(logger)
  app.use(timer)
  app.use(headerInjector)

  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "Welcome to the Middleware Playground!",
    });
  });

  app.get("/about", (req, res) => {
    res.json({
      success: true,
      data: {
        name: "Middleware Playground",
        version: "1.0.0",
      },
    });
  });

  app.get("/sequence", (req, res) => {
    res.json({
      executionLog: req.executionLog,
    });
  });

  return app;
}

module.exports = { createApp, logger, timer, headerInjector };

// If this file is run directly, start the server
if (require.main === module) {
  const app = createApp();
  const port = process.env.PORT || 4001;
  app.listen(port, () => {
    console.log("=== Middleware Playground Server Started ===");
    console.log(`Server running on http://localhost:${port}`);
  });
}
