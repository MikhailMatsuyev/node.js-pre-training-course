const http = require("http");
const url = require("url");

/**
 * Todo REST API Server
 * Built with Node.js built-in HTTP module
 * Supports full CRUD operations with in-memory storage
 */

/**
 * Parse JSON request body from HTTP request
 * @param {IncomingMessage} req - HTTP request object
 * @returns {Promise<Object>} Parsed JSON data
 */
function parseBody(req) {
  // TODO: Implement async JSON body parsing
  // 1. Create promise to handle async data streaming
  // 2. Listen for 'data' events to collect chunks
  // 3. Listen for 'end' event to parse complete body
  // 4. Handle JSON parsing errors gracefully
  // 5. Return empty object if no body provided

  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", (error) => {
      reject(error);
    });
  });
}

/**
 * Extract path parameters from URL pattern
 * @param {string} pattern - URL pattern like '/todos/:id'
 * @param {string} path - Actual path like '/todos/123'
 * @returns {Object} Extracted parameters like { id: "123" }
 */
function parsePathParams(pattern, path) {
  // TODO: Implement path parameter extraction
  // 1. Split pattern and path by '/'
  // 2. Find segments that start with ':'
  // 3. Extract corresponding values from path
  // 4. Return object with parameter names and values
  // 5. Handle edge cases (no params, mismatched segments)

  const params = {};

  const patternParts = pattern.split("/");
  const pathParts = path.split("/");

  patternParts.forEach((part, index) => {
    if (part.startsWith(":")) {
      const paramName = part.slice(1);
      params[paramName] = pathParts[index];
    }
  });

  return params;
}

/**
 * Send consistent JSON response
 * @param {ServerResponse} res - HTTP response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Response data
 */
function sendResponse(res, statusCode, data) {
  // TODO: Implement consistent response sending
  // 1. Set proper HTTP status code
  // 2. Set Content-Type to application/json
  // 3. Add CORS headers for browser compatibility
  // 4. Convert data to JSON string
  // 5. Send response and end connection

  // Headers to set:
  // - Content-Type: application/json
  // - Access-Control-Allow-Origin: *
  // - Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  // - Access-Control-Allow-Headers: Content-Type

  res.statusCode = statusCode;

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  res.end(JSON.stringify(data));
}

/**
 * Validate todo data according to business rules
 * @param {Object} todoData - Todo data to validate
 * @param {boolean} isUpdate - Whether this is an update operation
 * @returns {Object} Validation result with errors array
 */
function validateTodo(todoData, isUpdate = false) {
  // TODO: Implement todo data validation
  // 1. Check title requirements (required, string, 1-100 chars, not whitespace-only)
  // 2. Check description (optional, string, max 500 chars)
  // 3. Check completed (optional, boolean only)
  // 4. Return validation result with errors array
  // 5. Handle update vs create validation differences

  // Title validation
  // - Required for create, optional for update
  // - Must be string
  // - 1-100 characters
  // - Cannot be only whitespace

  // Description validation
  // - Optional field
  // - Must be string if provided
  // - Max 500 characters

  // Completed validation
  // - Optional field
  // - Must be boolean if provided

  const errors = [];

  // Title validation
  if (!isUpdate || todoData.title !== undefined) {
    if (typeof todoData.title !== "string") {
      errors.push("Title must be a string");
    } else if (todoData.title.trim().length === 0) {
      errors.push("Title cannot be only whitespace");
    } else if (todoData.title.length > 100) {
      errors.push("Title must be 1-100 characters");
    }
  }

  // Description validation
  if (todoData.description !== undefined) {
    if (typeof todoData.description !== "string") {
      errors.push("Description must be a string");
    } else if (todoData.description.length > 500) {
      errors.push("Description must be max 500 characters");
    }
  }

  // Completed validation
  if (
      todoData.completed !== undefined &&
      typeof todoData.completed !== "boolean"
  ) {
    errors.push("Completed must be a boolean");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * TodoServer Class - Main HTTP server for Todo API
 */
class TodoServer {
  constructor(port = 3000) {
    // TODO: Initialize server properties
    // 1. Set port number
    // 2. Initialize empty todos array
    // 3. Set nextId counter for new todos
    // 4. Initialize with sample data

    this.port = port;
    this.todos = [];
    this.nextId = 1;

    // Sample todos for testing
    this.initializeSampleData();
  }

  /**
   * Initialize server with sample todo data
   */
  initializeSampleData() {
    // TODO: Add sample todos for testing
    // 1. Create 2-3 sample todos with proper structure
    // 2. Include variety: completed/incomplete, different dates
    // 3. Set proper id sequence for new todos

    const sampleTodos = [
      {
        id: this.generateNextId(),
        title: "Learn Node.js",
        description: "Study Node.js built-in HTTP module",
        completed: false,
      },
      {
        id: this.generateNextId(),
        title: "Build REST API",
        description: "Implement Todo REST API with CRUD operations",
        completed: false,
      },
    ];

    const now = new Date().toISOString();

    this.todos = sampleTodos.map((todo) => ({
      ...todo,
      createdAt: now,
      updatedAt: now,
    }));
  }

  /**
   * Start the HTTP server
   */
  start() {
    // TODO: Create and start HTTP server
    // 1. Create HTTP server with request handler
    // 2. Listen on specified port
    // 3. Log server startup message
    // 4. Handle server errors

    const server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    server.on("error", (error) => {
      console.error("Server error:", error);
    });

    server.listen(this.port, () => {
      console.log(`Todo server is running on port ${this.port}`);
    });
  }

  /**
   * Main request handler - routes requests to appropriate methods
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  async handleRequest(req, res) {
    // TODO: Implement main request routing
    // 1. Parse URL and extract pathname, query
    // 2. Route based on HTTP method and path pattern
    // 3. Handle CORS preflight requests (OPTIONS)
    // 4. Call appropriate handler method
    // 5. Handle unknown routes with 404

    try {
      const parsedUrl = url.parse(req.url, true);
      const { pathname, query } = parsedUrl;
      const method = req.method;
      console.log(`${method} ${pathname}`);
      if (method === "GET" && pathname === "/todos") {
        await this.getAllTodos(req, res, query); return;
      }
      if (method === "GET" && pathname.startsWith("/todos/")) {
        const params = parsePathParams("/todos/:id", pathname);
        await this.getTodoById(req, res, params); return;
      } if (method === "POST" && pathname === "/todos") {
        await this.createTodo(req, res); return;
      } if (method === "PUT" && pathname.startsWith("/todos/")) {
        const params = parsePathParams("/todos/:id", pathname);
        await this.updateTodo(req, res, params); return;
      } if (method === "DELETE" && pathname.startsWith("/todos/")) {
        const params = parsePathParams("/todos/:id", pathname);
        await this.deleteTodo(req, res, params); return;
      } if (method === "OPTIONS") { this.handleCORS(req, res);
        return;
      } if (pathname.startsWith("/todos")) {
        sendResponse(res, 405, { success: false, error: "Method not allowed", });
        return;
      } sendResponse(res, 404, { success: false, error: "Not found", });
    } catch (error) { console.error("Request handling error:", error);
      if (error instanceof SyntaxError) { sendResponse(res, 400, { success: false, error: "Invalid JSON", });
        return;
      } sendResponse(res, 500, { success: false, error: "Internal server error", });
    }
  }

  /**
   * Handle GET /todos - Get all todos with optional filtering
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} query - URL query parameters
   */
  async getAllTodos(req, res, query) {
    // TODO: Implement get all todos with filtering
    // 1. Get all todos from storage
    // 2. Apply completed filter if provided in query
    // 3. Return success response with data and count
    // 4. Handle query parameter validation

    // 1. Get all todos from storage
    let todos = this.todos;

    // 2. Apply completed filter if provided in query
    if (query.completed !== undefined) {
      // 3. Handle query parameter validation
      if (query.completed !== "true" && query.completed !== "false") {
        sendResponse(res, 400, {
          success: false,
          error: "Invalid completed query parameter",
        });
        return;
      }

      const completed = query.completed === "true";
      todos = this.todos.filter((todo) => todo.completed === completed);
    }

    // 4. Return success response with data and count
    sendResponse(res, 200, {
      success: true,
      data: todos,
      count: todos.length,
    });
  }

  /**
   * Handle GET /todos/:id - Get specific todo by ID
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async getTodoById(req, res, params) {
    // TODO: Implement get todo by ID
    // 1. Extract ID from path parameters
    // 2. Find todo in storage
    // 3. Return 404 if not found
    // 4. Return success response with todo data
    // 5. Handle invalid ID format

    // 1. Extract ID from path parameters
    const id = params.id;

    // 5. Handle invalid ID format
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      sendResponse(res, 400, {
        success: false,
        error: "Invalid ID format",
      });
      return;
    }

    // 2. Find todo in storage
    const todo = this.findTodoById(numId);

    // 3. Return 404 if not found
    if (!todo) {
      sendResponse(res, 404, {
        success: false,
        error: "Todo not found",
      });
      return;
    }

    // 4. Return success response with todo data
    sendResponse(res, 200, {
      success: true,
      data: todo,
    });
  }

  /**
   * Handle POST /todos - Create new todo
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  async createTodo(req, res) {
    // TODO: Implement create new todo
    // 1. Parse request body
    const todoData = await parseBody(req);

    // 2. Validate todo data
    if (!todoData || typeof todoData !== "object" || Array.isArray(todoData)) {
      sendResponse(res, 400, {
        success: false,
        error: "Invalid todo data",
      });
      return;
    }

    const validation = validateTodo(todoData);

    // 6. Handle validation errors
    if (!validation.isValid) {
      sendResponse(res, 400, {
        success: false,
        error: validation.errors.join(", "),
      });
      return;
    }

    // 3. Create new todo with generated ID and timestamps
    const now = new Date().toISOString();

    const todo = {
      id: this.generateNextId(),
      title: todoData.title,
      description: todoData.description,
      completed: todoData.completed ?? false,
      createdAt: now,
      updatedAt: now,
    };

    // 4. Add to storage
    this.todos.push(todo);

    // 5. Return 201 with created todo
    sendResponse(res, 201, {
      success: true,
      data: todo,
    });
  }

  /**
   * Handle PUT /todos/:id - Update existing todo
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async updateTodo(req, res, params) {
    // TODO: Implement update existing todo
    // 1. Extract ID from path parameters
    // 2. Find existing todo
    // 3. Parse request body
    // 4. Validate update data
    // 5. Merge changes with existing todo
    // 6. Update timestamp
    // 7. Return updated todo
    // 8. Handle not found and validation errors

    // 1. Extract ID from path parameters
    const id = params.id;

    // 2. Find existing todo
    const todo = this.findTodoById(id);

    // 8. Handle not found and validation errors
    if (!todo) {
      sendResponse(res, 404, {
        success: false,
        error: "Todo not found",
      });
      return;
    }

    // 3. Parse request body
    const todoData = await parseBody(req);

    // 4. Validate update data
    const validation = validateTodo(todoData, true);

    if (!validation.isValid) {
      sendResponse(res, 400, {
        success: false,
        error: validation.errors.join(", "),
      });
      return;
    }

    // 5. Merge changes with existing todo
    Object.assign(todo, todoData);

    // 6. Update timestamp
    todo.updatedAt = new Date().toISOString();

    // 7. Return updated todo
    sendResponse(res, 200, {
      success: true,
      data: todo,
    });
  }

  /**
   * Handle DELETE /todos/:id - Delete todo
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   * @param {Object} params - Path parameters
   */
  async deleteTodo(req, res, params) {
    // 1. Extract ID from path parameters
    const id = params.id;

    // 6. Handle invalid ID format
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      sendResponse(res, 400, {
        success: false,
        error: "Invalid ID format",
      });
      return;
    }

    // 2. Find todo index in storage
    const index = this.findTodoIndexById(numId);

    // 3. Return 404 if not found
    if (index === -1) {
      sendResponse(res, 404, {
        success: false,
        error: "Todo not found",
      });
      return;
    }

    // 4. Remove from storage
    this.todos.splice(index, 1);

    // 5. Return success message
    sendResponse(res, 200, {
      success: true,
      message: "Todo deleted successfully",
    });
  }

  /**
   * Handle CORS preflight requests
   * @param {IncomingMessage} req - HTTP request
   * @param {ServerResponse} res - HTTP response
   */
  handleCORS(req, res) {
    // TODO: Implement CORS preflight handling
    // 1. Set CORS headers
    // 2. Return 204 No Content
    // 3. Handle preflight request properly

    console.log("CORS handling not implemented yet");
    sendResponse(res, 204, {});
  }

  /**
   * Find todo by ID in storage
   * @param {number|string} id - Todo ID
   * @returns {Object|null} Found todo or null
   */
  findTodoById(id) {
    // TODO: Implement find todo by ID
    // 1. Convert ID to number
    // 2. Search in todos array
    // 3. Return found todo or null
    // 4. Handle invalid ID format

    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      return null;
    }

    return this.todos.find((todo) => todo.id === numId) || null;
  }

  /**
   * Find todo index by ID in storage
   * @param {number|string} id - Todo ID
   * @returns {number} Todo index or -1 if not found
   */
  findTodoIndexById(id) {
    // TODO: Implement find todo index by ID
    // 1. Convert ID to number
    // 2. Find index in todos array
    // 3. Return index or -1 if not found

    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      return -1;
    }

    return this.todos.findIndex((todo) => todo.id === numId);
  }

  /**
   * Generate next available ID
   * @returns {number} Next ID
   */
  generateNextId() {
    // TODO: Implement ID generation
    // 1. Return current nextId
    // 2. Increment nextId for next use
    // 3. Handle edge cases

    return this.nextId++;
  }
}

// Export the TodoServer class
module.exports = TodoServer;

// Example usage (for testing):
const isReadyToTest = true;

if (isReadyToTest) {
  // Start server for testing
  const server = new TodoServer(3000);
  server.start();

  console.log("🚀 Todo Server starting...");
  console.log("📝 Replace TODO comments with implementation");
  console.log("🧪 Run task-04-test.js to verify functionality");
}

// If this file is run directly, start the server
if (require.main === module) {
  const server = new TodoServer(3000);
  server.start();
}
