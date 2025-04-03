# TodoMVC JavaScript Tests

This directory contains JavaScript tests for the TodoMVC React application using Playwright.

## Test Files

- `todo.spec.js`: Core functionality tests including adding, completing, filtering, and deleting todos
- `persistence.spec.js`: Tests for todo persistence between page reloads
- `edge-cases.spec.js`: Tests for handling edge cases like empty inputs and special characters

## Running Tests

From the root of the TodoMVC project, you can run the tests using the following commands:

```bash
# Run all tests
npm test

# Run tests with browser visible
npm run test:headed

# Run tests with UI mode
npm run test:ui
```

## Test Structure

All tests are written in JavaScript to maintain compatibility with the project requirements. The tests use Playwright's testing framework to interact with the TodoMVC application and verify its functionality.

The tests cover:

- Adding new todo items
- Marking todos as complete
- Filtering todos (All, Active, Completed)
- Deleting todos
- Editing existing todos
- Persistence between page reloads
- Edge cases and input validation

## Configuration

The tests are configured in `playwright.config.js` in the root directory. This configuration sets up the test environment, including starting the local server before running tests.