const fs = require("fs");
const fsPromises = require("fs").promises;
const util = require("util");

/**
 * Event Loop Analysis and Async Debugging
 * Learn Node.js event loop phases and fix broken async code
 */

/**
 * Analyze execution order of event loop phases
 * @returns {object} Analysis of execution order
 */
function analyzeEventLoop() {
  // TODO: Implement event loop analysis
  // 1. Create examples showing each event loop phase
  // 2. Demonstrate microtask vs macrotask priority
  // 3. Show execution order with detailed logging
  // 4. Return analysis object with explanations

  const analysis = {
    phases: [
      "timers",
      "pending callbacks",
      "idle, prepare",
      "poll",
      "check",
      "close callbacks",
    ],

    executionOrder: [
      "timers",
      "pending callbacks",
      "idle, prepare",
      "poll",
      "check",
      "close callbacks",
    ],

    explanations: [
      "Timers phase handles setTimeout and setInterval callbacks.",
      "Pending callbacks phase handles some deferred I/O callbacks.",
      "Idle, prepare phase is used internally by Node.js.",
      "Poll phase retrieves and processes I/O events.",
      "Check phase handles setImmediate callbacks.",
      "Close callbacks phase handles close events such as socket close callbacks.",
      "Microtasks are processed before the next macrotask.",
    ],
  };

  return analysis;
}

/**
 * Predict execution order for code snippets
 * @param {string} snippet - Code snippet identifier
 * @returns {array} Predicted execution order
 */
function predictExecutionOrder(snippet) {
  // TODO: Implement execution order prediction
  // 1. Analyze the provided code snippets
  // 2. Apply event loop phase rules
  // 3. Consider microtask priority
  // 4. Return predicted order with explanations
  const predictions = {
    snippet1: [
      '1. "Start" - synchronous code',
      '2. "End" - synchronous code',
      '3. "Next Tick 1" - process.nextTick microtask',
      '4. "Next Tick 2" - process.nextTick microtask',
      '5. "Promise 1" - Promise microtask',
      '6. "Promise 2" - Promise microtask',
      '7. "Timer 1" / "Timer 2" - timers phase',
      '8. "Immediate 1" / "Immediate 2" - check phase',
    ],

    snippet2: [
      '1. "=== Start ===" - synchronous code',
      '2. "=== End ===" - synchronous code',
      '3. "NextTick" - process.nextTick microtask',
      '4. "Nested NextTick" - nested process.nextTick microtask',
      '5. "Timer" - timers phase',
      '6. "NextTick in Timer" - process.nextTick after timer callback',
      '7. "Immediate" - check phase',
      '8. "NextTick in Immediate" - process.nextTick after immediate callback',
      '9. "fs.readFile" - poll phase / I/O callback',
      '10. "NextTick in readFile" - process.nextTick after I/O callback',
    ],
  };

  return predictions[snippet] || [];
}

/**
 * Fix race condition in file processing
 * @returns {Promise} Promise that resolves when files are processed
 */
async function fixRaceCondition() {
  // TODO: Fix the race condition in file processing
  // Issues to fix:
  // 1. Race condition in file processing
  // 2. Incorrect error handling
  // 3. Missing await keywords
  // 4. Array index might be wrong due to closure

  const files = ["file1.txt", "file2.txt", "file3.txt"];

  try {
    const results = [];

    for (const file of files) {
      const content = await fsPromises.readFile(file, "utf8");

      results.push({
        file,
        content,
      });
    }

    return results;
  } catch (error) {
    throw new Error(`Failed to process files: ${error.message}`);
  }
}

/**
 * Convert callback hell to async/await
 * @param {number} userId - User ID to process
 * @returns {Promise} Promise that resolves with processed user data
 */
async function fixCallbackHell(userId) {
  // TODO: Convert callback hell to async/await
  // Issues to fix:
  // 1. Callback hell structure
  // 2. No error handling for JSON.parse
  // 3. Repetitive error handling code
  // 4. No file existence checking
  // 5. Blocking operations

  try {
    const userFile = `user-${userId}.json`;
    const preferencesFile = `preferences-${userId}.json`;
    const activityFile = `activity-${userId}.json`;

    const files = [userFile, preferencesFile, activityFile];

    for (const file of files) {
      if (!fs.existsSync(file)) {
        throw new Error(`File not found: ${file}`);
      }
    }

    const [userData, preferencesData, activityData] = await Promise.all([
      fsPromises.readFile(userFile, "utf8"),
      fsPromises.readFile(preferencesFile, "utf8"),
      fsPromises.readFile(activityFile, "utf8"),
    ]);

    let user;
    let preferences;
    let activity;

    try {
      user = JSON.parse(userData);
      preferences = JSON.parse(preferencesData);
      activity = JSON.parse(activityData);
    } catch (error) {
      throw new Error(`Invalid JSON data: ${error.message}`);
    }

    const result = {
      user,
      preferences,
      activity,
    };

    await fsPromises.writeFile(
        `processed-user-${userId}.json`,
        JSON.stringify(result, null, 2),
        "utf8"
    );

    return result;
  } catch (error) {
    throw new Error(`Failed to process user data: ${error.message}`);
  }
}

/**
 * Fix mixed promises and callbacks
 * @returns {Promise} Promise that resolves when processing is complete
 */
async function fixMixedAsync() {
  // TODO: Fix mixed promises and callbacks
  // Issues to fix:
  // 1. Mixing promises and callbacks inconsistently
  // 2. Nested async operations without proper chaining
  // 3. Error handling inconsistencies
  // 4. No proper async/await usage

  try {
    console.log("Processing async data...");

    const inputFile = require("path").join(__dirname, "test-data", "input.txt");
    const outputFile = require("path").join(
        __dirname,
        "test-data",
        "processed-input.txt"
    );

    const data = await fsPromises.readFile(inputFile, "utf8");

    const processedData = data.toUpperCase();

    await fsPromises.writeFile(outputFile, processedData, "utf8");

    console.log("Processing completed");
    console.log("Result:", processedData);

    return processedData;
  } catch (error) {
    throw new Error(`Failed to process data: ${error.message}`);
  }
}

/**
 * Demonstrate all event loop phases
 * @returns {Promise} Promise that resolves when demonstration is complete
 */
async function demonstrateEventLoop() {
  // TODO: Create comprehensive event loop demonstration
  // 1. Show timers phase (setTimeout, setInterval)
  // 2. Show pending callbacks phase
  // 3. Show poll phase (I/O operations)
  // 4. Show check phase (setImmediate)
  // 5. Show close callbacks phase
  // 6. Demonstrate microtask priority (nextTick, Promises)

  console.log("=== Event Loop Demonstration ===");

  console.log("Synchronous code");

  process.nextTick(() => {
    logWithPhase("process.nextTick callback", "microtask");
  });

  Promise.resolve().then(() => {
    logWithPhase("Promise.then callback", "microtask");
  });

  setTimeout(() => {
    logWithPhase("setTimeout callback", "timers");
  }, 0);

  const interval = setInterval(() => {
    logWithPhase("setInterval callback", "timers");
    clearInterval(interval);
  }, 0);

  fs.readFile(__filename, "utf8", () => {
    logWithPhase("fs.readFile callback", "poll");
  });

  setImmediate(() => {
    logWithPhase("setImmediate callback", "check");
  });

  const server = require("net").createServer();

  server.listen(0, () => {
    logWithPhase("Server listening callback", "poll");

    server.close(() => {
      logWithPhase("Server close callback", "close callbacks");
    });
  });

  await new Promise((resolve) => {
    setTimeout(resolve, 50);
  });

  console.log("=== Event Loop Demonstration Finished ===");
}

/**
 * Create test files for debugging exercises
 */
async function createTestFiles() {
  // TODO: Create test files for the exercises
  // 1. Create sample user data files
  // 2. Create input files for processing
  // 3. Handle file creation errors gracefully

  const testData = {
    "user-123.json": {
      id: 123,
      name: "John Doe",
      email: "john@example.com",
    },
    "preferences-123.json": {
      theme: "dark",
      language: "en",
      notifications: true,
    },
    "activity-123.json": {
      lastLogin: "2025-01-01",
      sessionsCount: 42,
      totalTime: 3600,
    },
    "input.txt": "Hello World! This is test data for processing.",
    "file1.txt": "Content of file 1",
    "file2.txt": "Content of file 2",
    "file3.txt": "Content of file 3",
  };

  try {
    for (const [fileName, data] of Object.entries(testData)) {
      const content =
          typeof data === "object"
              ? JSON.stringify(data, null, 2)
              : data;

      await fsPromises.writeFile(fileName, content, "utf8");
    }

    console.log("Test files created successfully");
  } catch (error) {
    console.error("Failed to create test files:", error.message);
  }
}

/**
 * Helper function to log with timestamps
 * @param {string} message - Message to log
 * @param {string} phase - Event loop phase
 */
function logWithPhase(message, phase = "unknown") {
  // TODO: Implement detailed logging
  // 1. Add timestamp
  // 2. Add event loop phase information
  // 3. Add color coding for different phases
  // 4. Format output for better readability

  const timestamp = new Date().toISOString();

  const colors = {
    timers: "\x1b[33m",
    "pending callbacks": "\x1b[35m",
    "idle, prepare": "\x1b[36m",
    poll: "\x1b[32m",
    check: "\x1b[34m",
    "close callbacks": "\x1b[31m",
    unknown: "\x1b[37m",
  };

  const reset = "\x1b[0m";
  const color = colors[phase.toLowerCase()] || colors.unknown;

  console.log(
      `${color}[${timestamp}] [Phase: ${phase}] ${message}${reset}`
  );
}

// Export functions and data
module.exports = {
  analyzeEventLoop,
  predictExecutionOrder,
  fixRaceCondition,
  fixCallbackHell,
  fixMixedAsync,
  demonstrateEventLoop,
  createTestFiles,
  logWithPhase,
};

// Example usage (for testing):
const isReadyToTest = true;

if (isReadyToTest) {
  async function runExamples() {
    console.log("🔄 Starting Event Loop Analysis Examples...\n");

    // Create test files
    await createTestFiles();

    // Demonstrate event loop
    console.log("=== Event Loop Demonstration ===");
    await demonstrateEventLoop();

    // Analyze execution order
    console.log("\n=== Execution Order Analysis ===");
    const analysis = analyzeEventLoop();
    console.log("Analysis:", analysis);

    // Fix broken code
    console.log("\n=== Fixing Broken Code ===");
    try {
      await fixRaceCondition();
      console.log("✅ Race condition fixed");

      await fixCallbackHell(123);
      console.log("✅ Callback hell converted");

      await fixMixedAsync();
      console.log("✅ Mixed async resolved");
    } catch (error) {
      console.error("❌ Error fixing code:", error.message);
    }
  }

  if (require.main === module) {
    runExamples();
  }
}
