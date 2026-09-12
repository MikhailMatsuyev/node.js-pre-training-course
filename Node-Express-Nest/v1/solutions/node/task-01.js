const EventEmitter = require("events")
const fs = require("fs").promises;
const path = require("path");

/**
 * Custom Event Emitter for a messaging system
 * Extend Node.js EventEmitter to create a pub-sub messaging system
 */
class MessageSystem extends EventEmitter {
  constructor() {
    super();
    // Initialize the messaging system
    this.messages = [];
    this.messageTimestamps = [];
    this.users = new Set();
    this.messageId = 1;

    this.historyFile = path.join(__dirname, "messages.json");

    this.saveQueue = Promise.resolve();
  }

  async saveHistory() {
    const data = JSON.stringify(this.messages, null, 2);

    await fs.writeFile(this.historyFile, data, "utf-8");
  }

  /**
   * Send a message to the system
   *
   * Create a message object with id, type, content, timestamp, sender
   * Add message to messages array
   * Keep only last 100 messages for memory management
   * Emit the message event and specific type event
   *
   * @param {string} type - Message type ('message', 'notification', 'alert')
   * @param {string} content - Message content
   * @param {string} sender - Optional sender name
   * @returns {object} Created message object
   */
  sendMessage(type, content, sender = "System") {
    if (sender !== "System") {
      this.checkRateLimit();
    }

    const message = {
      id: String(this.messageId++),
      type,
      content,
      timestamp: new Date(),
      sender,
    };

    this.messages.push(message);

    if (this.messages.length > 100) {
      this.messages.shift();
    }

    this.emit("message", message);
    if (type !== "message") {
      this.emit(type, message);
    }

    // The queue for messages
    this.saveQueue = this.saveQueue
        .then(() => this.saveHistory())
        .catch(console.error);

    return message;
  }

  /**
   * Subscribe to all message types
   *
   * Listen to all messages using the 'message' event
   *
   * @param {function} callback - Callback function to handle messages
   */
  subscribeToMessages(callback) {
    this.on("message", callback);
  }

  /**
   * Subscribe to specific message type
   *
   *  Listen to specific message type events
   *
   * @param {string} type - Message type to subscribe to
   * @param {function} callback - Callback function to handle messages
   */

  subscribeToType(type, callback) {
    this.on(type, callback);
  }

  /**
   * Get current number of active users
   *
   * Return the number of users
   *
   * @returns {number} Number of active users
   */
  getUserCount() {
    return this.users.size;
  }

  /**
   * Get the last N messages (default 10)
   *
   * Return the last 'count' messages
   *
   * @param {number} count - Number of messages to retrieve
   * @returns {array} Array of recent messages
   */
  getMessageHistory(count = 10) {
    return this.messages.slice(-count);
  }

  searchMessages(query) {
    const normalizedQuery = query.toLowerCase();

    return this.messages.filter((message) =>
        message.content.toLowerCase().includes(normalizedQuery)
    );
  }

  /**
   * Add a user to the system
   *
   * Add user to users set (avoid duplicates)
   * Create and emit user-joined event
   *
   * @param {string} username - Username to add
   */
  addUser(username) {
    if (!this.users.has(username)) {
      this.users.add(username);

      this.emit("user-joined", {
        content: `User ${username} joined`,
      });
    }
  }

  /**
   * Remove a user from the system
   *
   * Remove user from users set
   * Create and emit user-left event
   *
   * @param {string} username - Username to remove
   */
  removeUser(username) {
    if (this.users.has(username)) {
      this.users.delete(username);

      this.emit("user-left", {
        content: `User ${username} left`,
      });
    }
  }

  /**
   * Get all active users
   *
   * Convert users Set to Array and return
   *
   * @returns {array} Array of usernames
   */
  getActiveUsers() {
    return Array.from(this.users);
  }

  /**
   * Clear all messages
   *
   * Clear messages array
   * Emit history-cleared event
   */
  clearHistory() {
    this.messages = [];
  }

  checkRateLimit() {
    const now = Date.now();
    const limit = 5;
    const window = 10 * 1000;

    this.messageTimestamps = this.messageTimestamps.filter(
        (timestamp) => now - timestamp < window
    );

    if (this.messageTimestamps.length >= limit) {
      throw new Error("Rate limit exceeded");
    }

    this.messageTimestamps.push(now);
  }

  /**
   * Get system statistics
   *
   * Calculate and return statistics
   *
   * @returns {object} System stats
   */
  getStats() {
    const messagesByType = {};

    for (const message of this.messages) {
      messagesByType[message.type] =
          (messagesByType[message.type] || 0) + 1;
    }

    return {
      totalMessages: this.messages.length,
      activeUsers: this.users.size,
      messagesByType,
    };
  }

  // Cause we cant do: async constructor() {}
  async init() {
    await this.loadHistory();
  }

  async loadHistory() {
    try {
      const data = await fs.readFile(this.historyFile, "utf-8");
      // console.log("JSON DATA:", data);


      const messages = JSON.parse(data);

      this.messages = messages.slice(-100).map((message) => ({
        ...message,
        timestamp: new Date(message.timestamp),
      }));

      if (this.messages.length > 0) {
        const lastId = Number(this.messages[this.messages.length - 1].id);
        this.messageId = lastId + 1;
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        this.messages = [];
      } else {
        throw error;
      }
    }
  }
}

// Export the MessageSystem class
module.exports = MessageSystem;

// Example usage (for testing):
const isReadyToTest = true;

if (isReadyToTest) {
  const messenger = new MessageSystem();

  // Subscribe to all messages
  messenger.subscribeToMessages((message) => {
    console.log(`[${message.type.toUpperCase()}] ${message.content}`);
  });

  // Subscribe to specific alert messages
  messenger.subscribeToType("alert", (message) => {
    console.log(`🚨 ALERT: ${message.content}`);
  });

  // Subscribe to user events
  messenger.subscribeToType("user-joined", (message) => {
    console.log(`👋 ${message.content}`);
  });

  messenger.subscribeToType("user-left", (message) => {
    console.log(`👋 ${message.content}`);
  });

  // Add users
  messenger.addUser("Alice");
  messenger.addUser("Bob");

  // Send various messages
  messenger.sendMessage("message", "Hello everyone!", "Alice");
  messenger.sendMessage("notification", "System maintenance in 1 hour");
  messenger.sendMessage("alert", "Server overload detected!");

  // Remove user
  messenger.removeUser("Bob");

  // Check system status
  console.log(`\nActive users: ${messenger.getUserCount()}`);
  console.log("Recent messages:", messenger.getMessageHistory()?.length);
  console.log("System stats:", messenger.getStats());

  // =========================
  // Bonus features
  // =========================

  // Bonus 1: Message persistence
  // Save history to messages.json
  messenger.saveQueue.then(() => {
    console.log("Message history saved");
  });

  // Bonus 2: Message search
  console.log(
      "Search results:",
      messenger.searchMessages("server")
  );

  // Bonus 3: Rate limiting
  try {
    for (let i = 1; i <= 5; i++) {
      messenger.sendMessage(
          "message",
          `Rate limit test ${i}`,
          "Alice"
      );
    }

    console.log("Rate limit: first 5 messages passed");

    messenger.sendMessage(
        "message",
        "Rate limit test 6",
        "Alice"
    );
  } catch (error) {
    console.log("Rate limit: 6th message blocked");
  }
}
