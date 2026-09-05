module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts", "**/*.test.js"],
  moduleFileExtensions: ["ts", "tsx", "js"],
  verbose: true,
  collectCoverageFrom: [
    "JS-TS/solutions/todo-service.ts",
    "JS-TS/solutions/repository.ts",
  ],
};
