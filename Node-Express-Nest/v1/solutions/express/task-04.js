const express = require("express");
const todoService = require("./todoService");

const todoRouter = express.Router();

/**
 * Task 04: Wire Up ToDo REST API
 * Express app that serves ToDo CRUD endpoints backed by todoService.js.
 */

/**
 * Validation middleware for creating/updating a todo.
 * POST -> title required (non-empty string after trimming)
 * PUT  -> title optional, but must be a non-empty string if provided
 */
function validateTodoBody(req, res, next) {
  // TODO: Implement validation
  // 1. const isCreate = req.method === "POST"
  // 2. const { title } = req.body || {}
  // 3. If isCreate and title is missing/not a string/blank after trim,
  //    respond 400 with { success: false, error: "title is required" }
  //    and do NOT call next()
  // 4. If it's an update (PUT) and title IS provided, apply the same
  //    "must be a non-empty string" check
  // 5. Otherwise call next()

  const { title } = req.body;

  if (req.method === "POST") {
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "title is required",
      });
    }
  }

  if (req.method === "PUT") {
    if (title !== undefined) {
      if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
          success: false,
          error: "title must be a non-empty string",
        });
      }
    }
  }

  next();
}

/**
 * Build and configure the Express app for this task.
 * @returns {import("express").Express}
 */
function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/todos", todoRouter);

  todoRouter.get("/", (req, res) => {
    // TODO: Implement GET /todos
    // 1. Read req.query.completed (string "true"/"false" or undefined)
    // 2. Build filters object for todoService.getAll (only include
    //    `completed` if the query param was actually provided)
    // 3. const data = todoService.getAll(filters)
    // 4. Respond 200 with { success: true, data, count: data.length }

    const filters = {};

    if (req.query.completed !== undefined) {
      filters.completed = req.query.completed === "true";
    }

    const todos = todoService.getAll(filters);

    res.json({
      success: true,
      data: todos,
      count: todos.length,
    });
  });

  todoRouter.get("/:id", (req, res) => {
    // TODO: Implement GET /todos/:id
    // 1. const todo = todoService.getById(req.params.id)
    // 2. If not found, respond 404 with
    //    { success: false, error: "Todo not found" }
    // 3. Otherwise respond 200 with { success: true, data: todo }

    const todo = todoService.getById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: "Todo not found",
      });
    }

    res.json({
      success: true,
      data: todo,
    });
  });

  todoRouter.post("/", validateTodoBody, (req, res) => {
    // TODO: Implement POST /todos
    // 1. const todo = todoService.create(req.body)
    // 2. Respond 201 with { success: true, data: todo }

    const todo = todoService.create(req.body);

    res.status(201).json({
      success: true,
      data: todo,
    });
  });

  todoRouter.put("/:id", validateTodoBody, (req, res) => {
    // TODO: Implement PUT /todos/:id
    // 1. const updated = todoService.update(req.params.id, req.body)
    // 2. If undefined, respond 404 with
    //    { success: false, error: "Todo not found" }
    // 3. Otherwise respond 200 with { success: true, data: updated }

    const todo = todoService.update(req.params.id, req.body);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: "Todo not found",
      });
    }

    res.json({
      success: true,
      data: todo,
    });
  });

  todoRouter.delete("/:id", (req, res) => {
    // TODO: Implement DELETE /todos/:id
    // 1. const removed = todoService.remove(req.params.id)
    // 2. If false, respond 404 with
    //    { success: false, error: "Todo not found" }
    // 3. Otherwise respond 200 with
    //    { success: true, message: "Todo deleted successfully" }

    const removed = todoService.remove(req.params.id);

    if (!removed) {
      return res.status(404).json({
        success: false,
        error: "Todo not found",
      });
    }

    res.json({
      success: true,
      message: "Todo deleted successfully",
    });
  });

  return app;
}

module.exports = { createApp, validateTodoBody };

// If this file is run directly, start the server
if (require.main === module) {
  const app = createApp();
  const port = process.env.PORT || 4004;
  app.listen(port, () => {
    console.log("=== Todo REST API (Express) Server Started ===");
    console.log(`Server running on http://localhost:${port}`);
  });
}
