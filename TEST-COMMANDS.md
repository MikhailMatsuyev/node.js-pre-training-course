# Test Commands

## Running All Tests
```bash
npm test
# or
npm run test:all
```

## Running Individual Test Files

### React CSS Tests
```bash
# React CSS tests are now in the separate react-todo-app project
cd React-CSS/react-todo-app
npm test
```

### Docker Git Tests
```bash
npm run test:docker-git
```

### JS TS Tests
```bash
npm run test:js-ts
```

## Additional Commands

### Running Tests in Watch Mode
```bash
npm run test:watch
```

### Running Tests with Code Coverage
```bash
npm run test:coverage
```

## Command Descriptions

- `npm test` / `npm run test:all` - runs all tests in the `tests/` folder
- React CSS tests - now in separate project at `React-CSS/react-todo-app`
- `npm run test:docker-git` - runs only Docker Git tests
- `npm run test:js-ts` - runs only JS TS tests
- `npm run test:watch` - runs tests in watch mode (automatically restarts when changes are detected)
- `npm run test:coverage` - runs tests with code coverage report generation

## Test Structure

Tests are located in the `tests/` folder:
- `docker-git.test.js` - tests for Docker Git
- `js-ts-task-01..10.test.ts` - tests for JS/TS (one file per task; task 9 has
  none by design - you write it yourself)

The DB module has no automated tests yet.

React CSS tests are now in the separate project at `React-CSS/react-todo-app/` 