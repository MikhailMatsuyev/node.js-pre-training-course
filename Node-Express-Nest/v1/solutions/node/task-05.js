/**
 * task-05.js
 * Extend your Task 04 server by adding EventEmitter functionality,
 * logging, analytics, and new endpoints.
 *
 * Implement all TODOs below.
 */

const http = require("http");
const url = require("url");
const { EventEmitter } = require("events");

// ---------- Utilities ----------

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(data);
}

function parseIdFromPath(pathname) {
  const m = pathname.match(/^\/todos\/(\d+)$/);
  return m ? Number(m[1]) : null;
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        const json = JSON.parse(data);
        resolve(json);
      } catch (e) {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function nowISO() {
  return new Date().toISOString();
}

// ---------- Analytics ----------

class AnalyticsTracker {
  constructor() {
    this.stats = {
      totalCreated: 0,
      totalUpdated: 0,
      totalDeleted: 0,
      totalViews: 0,
      errors: 0,
      dailyStats: {},
    };
  }
  _bumpDaily(field) {
    // - use YYYY-MM-DD date keys
    // - track created, updated, deleted, views per day

    const date = new Date().toISOString().slice(0, 10);

    if (!this.stats.dailyStats[date]) {
      this.stats.dailyStats[date] = {
        created: 0,
        updated: 0,
        deleted: 0,
        views: 0,
      };
    }

    this.stats.dailyStats[date][field]++;
    }

  trackCreated() {
    this.stats.totalCreated++;
    this._bumpDaily("created");
  }
  trackUpdated() {
    this.stats.totalUpdated++;
    this._bumpDaily("updated");
  }
  trackDeleted() {
    this.stats.totalDeleted++;
    this._bumpDaily("deleted");
  }
  trackViewed() {
    this.stats.totalViews++;
    this._bumpDaily("views");
  }
  trackError() {
    this.stats.errors++;
  }
  getStats() {
    return this.stats;
  }
}

// ---------- Console Logger ----------
class ConsoleLogger {
  todoCreated(data) {
    console.log(
      `📝 [${data.timestamp}] Created "${data.todo.title}" (ID: ${data.todo.id})`
    );
  }
  todoUpdated(data) {
    console.log(
      `✏️  [${data.timestamp}] Updated ID ${
        data.newTodo.id
      }; changed: ${data.changes.join(", ")}`
    );
  }
  todoDeleted(data) {
    console.log(
      `🗑️  [${data.timestamp}] Deleted "${data.todo.title}" (ID: ${data.todo.id})`
    );
  }
  todoViewed(data) {
    console.log(`👁️  [${data.timestamp}] Viewed ID ${data.todo.id}`);
  }
  todosListed(data) {
    console.log(`📃 [${data.timestamp}] Listed todos count=${data.count}`);
  }
  todoNotFound(data) {
    console.warn(
      `⚠️  [${data.timestamp}] Not found: id=${data.todoId} op=${data.operation}`
    );
  }
  validationError(data) {
    console.error(
      `❌ [${data.timestamp}] Validation error: ${data.errors.join(", ")}`
    );
  }
  serverError(data) {
    console.error(
      `💥 [${data.timestamp}] Server error in ${data.operation}: ${
        data.error && data.error.message
      }`
    );
  }
}

// ---------- Validation ----------
function validateTodoPayload(payload, isCreate = false) {
  const errors = [];
  const out = {};

  // TODO: implement full validation logic
  // - title: required, non-empty string
  // - description: optional, string
  // - completed: optional, boolean (default false)

  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    errors.push("Payload must be an object");
    return { errors, values: out };
  }

  if (isCreate && (!("title" in payload) || typeof payload.title !== "string" || !payload.title.trim())) {
    errors.push("Title is required and must be a non-empty string");
  } else if ("title" in payload) {
    if (typeof payload.title !== "string" || !payload.title.trim()) {
      errors.push("Title must be a non-empty string");
    } else {
      out.title = payload.title.trim();
    }
  }

  if ("description" in payload) {
    if (typeof payload.description !== "string") {
      errors.push("Description must be a string");
    } else {
      out.description = payload.description;
    }
  }

  if ("completed" in payload) {
    if (typeof payload.completed !== "boolean") {
      errors.push("Completed must be a boolean");
    } else {
      out.completed = payload.completed;
    }
  } else if (isCreate) {
    out.completed = false;
  }

  return { errors, values: out };
}

class TodoServer extends EventEmitter {
  constructor(port = 3000) {
    super();
    this.port = port;
    this.todos = [];
    this.nextId = 1;

    this.analytics = new AnalyticsTracker();
    this.logger = new ConsoleLogger();
    this.recentEvents = [];

    this.server = null;

    this._wireDefaultListeners();
  }

  _wireDefaultListeners() {
    const remember = (eventType) => (data) => {
      this.recentEvents.push({ eventType, timestamp: nowISO(), data });
      if (this.recentEvents.length > 100) this.recentEvents.shift();
    };
    // Remember all key events for /events
    [
      "todoCreated",
      "todoUpdated",
      "todoDeleted",
      "todoViewed",
      "todosListed",
      "todoNotFound",
      "validationError",
      "serverError",
    ].forEach((evt) => this.on(evt, remember(evt)));

    // Logging
    this.on("todoCreated", (d) => this.logger.todoCreated(d));
    this.on("todoUpdated", (d) => this.logger.todoUpdated(d));
    this.on("todoDeleted", (d) => this.logger.todoDeleted(d));
    this.on("todoViewed", (d) => this.logger.todoViewed(d));
    this.on("todosListed", (d) => this.logger.todosListed(d));
    this.on("todoNotFound", (d) => this.logger.todoNotFound(d));
    this.on("validationError", (d) => this.logger.validationError(d));
    this.on("serverError", (d) => this.logger.serverError(d));

    // Analytics
    this.on("todoCreated", () => this.analytics.trackCreated());
    this.on("todoUpdated", () => this.analytics.trackUpdated());
    this.on("todoDeleted", () => this.analytics.trackDeleted());
    this.on("todoViewed", () => this.analytics.trackViewed());
    this.on("validationError", () => this.analytics.trackError());
    this.on("serverError", () => this.analytics.trackError());
  }

  /**
   * Start the server
   */
  async start() {
    this.server = http.createServer((req, res) => {
      this._handleRequest(req, res).catch((error) => {
        const requestInfo = {
          method: req.method,
          url: req.url,
          userAgent: req.headers["user-agent"] || "",
          ip: req.socket.remoteAddress || "",
        };

        this.emit("serverError", {
          error,
          operation: "request",
          requestInfo,
          timestamp: nowISO(),
        });

        sendJson(res, 500, {
          success: false,
          error: "Internal server error",
        });
      });
    });

    await new Promise((resolve, reject) => {
      this.server.once("error", reject);
      this.server.listen(this.port, resolve);
    });
  }

  /**
   * Stop the server
   */
  async stop() {
    if (!this.server) {
      return;
    }

    await new Promise((resolve, reject) => {
      this.server.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    this.server = null;
  }

  /**
   * Handle incoming requests
   */
  async _handleRequest(req, res) {
    // CORS preflight
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      return res.end();
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // GET /todos
    if (req.method === "GET" && pathname === "/todos") {
      let todos = [...this.todos];

      if (parsedUrl.query.completed !== undefined) {
        const completed = parsedUrl.query.completed === "true";
        todos = todos.filter((todo) => todo.completed === completed);
      }

      this.emit("todosListed", {
        todos,
        count: todos.length,
        filters: parsedUrl.query,
        timestamp: nowISO(),
        requestInfo: {
          method: req.method,
          url: req.url,
          userAgent: req.headers["user-agent"] || "",
          ip: req.socket.remoteAddress || "",
        },
      });

      return sendJson(res, 200, {
        success: true,
        data: todos,
        count: todos.length,
      });
    }

    // POST /todos
    if (req.method === "POST" && pathname === "/todos") {
      let payload;

      try {
        payload = await parseBody(req);
      } catch (error) {
        const requestInfo = {
          method: req.method,
          url: req.url,
          userAgent: req.headers["user-agent"] || "",
          ip: req.socket.remoteAddress || "",
        };

        this.emit("validationError", {
          errors: [error.message],
          data: null,
          requestInfo,
          timestamp: nowISO(),
        });

        return sendJson(res, 400, {
          success: false,
          errors: [error.message],
        });
      }

      const validation = validateTodoPayload(payload, true);

      if (validation.errors.length > 0) {
        const requestInfo = {
          method: req.method,
          url: req.url,
          userAgent: req.headers["user-agent"] || "",
          ip: req.socket.remoteAddress || "",
        };

        this.emit("validationError", {
          errors: validation.errors,
          data: payload,
          requestInfo,
          timestamp: nowISO(),
        });

        return sendJson(res, 400, {
          success: false,
          errors: validation.errors,
        });
      }

      const todo = {
        id: this.nextId++,
        ...validation.values,
      };

      this.todos.push(todo);

      this.emit("todoCreated", {
        todo,
        timestamp: nowISO(),
        requestInfo: {
          method: req.method,
          url: req.url,
          userAgent: req.headers["user-agent"] || "",
          ip: req.socket.remoteAddress || "",
        },
      });

      return sendJson(res, 201, {
        success: true,
        data: todo,
      });
    }

    const id = parseIdFromPath(pathname);

    // GET /todos/:id
    if (req.method === "GET" && id !== null) {
      const todo = this.todos.find((item) => item.id === id);

      if (!todo) {
        this.emit("todoNotFound", {
          todoId: id,
          operation: "view",
          timestamp: nowISO(),
          requestInfo: {
            method: req.method,
            url: req.url,
            userAgent: req.headers["user-agent"] || "",
            ip: req.socket.remoteAddress || "",
          },
        });

        return sendJson(res, 404, {
          success: false,
          error: "Todo not found",
        });
      }

      this.emit("todoViewed", {
        todo,
        timestamp: nowISO(),
        requestInfo: {
          method: req.method,
          url: req.url,
          userAgent: req.headers["user-agent"] || "",
          ip: req.socket.remoteAddress || "",
        },
      });

      return sendJson(res, 200, {
        success: true,
        data: todo,
      });
    }

    // PUT /todos/:id
    if (req.method === "PUT" && id !== null) {
      const todo = this.todos.find((item) => item.id === id);

      if (!todo) {
        this.emit("todoNotFound", {
          todoId: id,
          operation: "update",
          timestamp: nowISO(),
          requestInfo: {
            method: req.method,
            url: req.url,
            userAgent: req.headers["user-agent"] || "",
            ip: req.socket.remoteAddress || "",
          },
        });

        return sendJson(res, 404, {
          success: false,
          error: "Todo not found",
        });
      }

      let payload;

      try {
        payload = await parseBody(req);
      } catch (error) {
        const requestInfo = {
          method: req.method,
          url: req.url,
          userAgent: req.headers["user-agent"] || "",
          ip: req.socket.remoteAddress || "",
        };

        this.emit("validationError", {
          errors: [error.message],
          data: null,
          requestInfo,
          timestamp: nowISO(),
        });

        return sendJson(res, 400, {
          success: false,
          errors: [error.message],
        });
      }

      const validation = validateTodoPayload(payload, false);

      if (validation.errors.length > 0) {
        const requestInfo = {
          method: req.method,
          url: req.url,
          userAgent: req.headers["user-agent"] || "",
          ip: req.socket.remoteAddress || "",
        };

        this.emit("validationError", {
          errors: validation.errors,
          data: payload,
          requestInfo,
          timestamp: nowISO(),
        });

        return sendJson(res, 400, {
          success: false,
          errors: validation.errors,
        });
      }

      const oldTodo = { ...todo };
      const changes = Object.keys(validation.values);

      Object.assign(todo, validation.values);

      this.emit("todoUpdated", {
        oldTodo,
        newTodo: { ...todo },
        changes,
        timestamp: nowISO(),
        requestInfo: {
          method: req.method,
          url: req.url,
          userAgent: req.headers["user-agent"] || "",
          ip: req.socket.remoteAddress || "",
        },
      });

      return sendJson(res, 200, {
        success: true,
        data: todo,
      });
    }

    // DELETE /todos/:id
    if (req.method === "DELETE" && id !== null) {
      const index = this.todos.findIndex((item) => item.id === id);

      if (index === -1) {
        this.emit("todoNotFound", {
          todoId: id,
          operation: "delete",
          timestamp: nowISO(),
          requestInfo: {
            method: req.method,
            url: req.url,
            userAgent: req.headers["user-agent"] || "",
            ip: req.socket.remoteAddress || "",
          },
        });

        return sendJson(res, 404, {
          success: false,
          error: "Todo not found",
        });
      }

      const [todo] = this.todos.splice(index, 1);

      this.emit("todoDeleted", {
        todo,
        timestamp: nowISO(),
        requestInfo: {
          method: req.method,
          url: req.url,
          userAgent: req.headers["user-agent"] || "",
          ip: req.socket.remoteAddress || "",
        },
      });

      return sendJson(res, 200, {
        success: true,
        data: todo,
      });
    }

    // GET /analytics
    if (req.method === "GET" && pathname === "/analytics") {
      return sendJson(res, 200, {
        success: true,
        data: this.analytics.getStats(),
      });
    }

    // GET /events
    if (req.method === "GET" && pathname === "/events") {
      const last = parsedUrl.query.last
          ? Number(parsedUrl.query.last)
          : 10;

      const limit = Number.isInteger(last) && last >= 0
          ? Math.min(last, 100)
          : 10;

      const events = this.recentEvents.slice(-limit);

      return sendJson(res, 200, {
        success: true,
        data: events,
      });
    }

    // Route not found
    return sendJson(res, 404, {
      success: false,
      error: "Route not found",
    });
  }
}

module.exports = { TodoServer };
