const express = require("express");

/**
 * Task 02: Params and Queries Challenge with Validation
 * GET /users/:id?active=true|false
 */

/**
 * Validation middleware for GET /users/:id
 * Validates req.params.id (must be a positive integer) and
 * req.query.active (must be exactly "true" or "false").
 */
function validateUserParams(req, res, next) {
  const id = req.params.id;

  if (!/^\d+$/.test(id) || Number(id) <= 0) {
    return res.status(400).json({
      success: false,
      error: "id must be a positive number",
    });
  }

  const active = req.query.active;

  if (active !== "true" && active !== "false") {
    return res.status(400).json({
      success: false,
      error: "active must be 'true' or 'false'",
    });
  }

  req.validated = {
    id: Number(id),
    active: active === "true",
  };

  next();
}

/**
 * Build and configure the Express app for this task.
 * @returns {import("express").Express}
 */
function createApp() {
  const app = express();

  app.get("/users/:id", validateUserParams, (req, res) => {
    const { id, active } = req.validated;
    const message = `User ${id} is ${active ? "active" : "inactive"}`;

    res.status(200).json({
      success: true,
      data: {
        id,
        active,
      },
      message,
    });
  });

  return app;
}

module.exports = { createApp, validateUserParams };

// If this file is run directly, start the server
if (require.main === module) {
  const app = createApp();
  const port = process.env.PORT || 4002;
  app.listen(port, () => {
    console.log("=== Params and Queries Server Started ===");
    console.log(`Server running on http://localhost:${port}`);
  });
}
