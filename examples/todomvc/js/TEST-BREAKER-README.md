# Test Breaker for TodoMVC

This tool is designed to randomly introduce bugs into the TodoMVC application to intentionally break Playwright tests. It's useful for testing the robustness of your test suite and practicing debugging skills.

## How It Works

The test breaker consists of two main files:

1. `test-breaker.js` - The main script that introduces random bugs
2. `test-breaker-loader.js` - A loader script that controls when the test breaker is activated

## Types of Bugs Introduced

The test breaker can randomly introduce several types of issues:

- **Selector Changes**: Modifies CSS class names that tests rely on
- **Event Handler Breaks**: Interferes with click, keypress, and other event handlers
- **Storage Issues**: Corrupts or blocks localStorage operations
- **Timing Issues**: Introduces random delays in state updates

## How to Use

The test breaker is already included in the application but is **inactive by default**. You can activate it in several ways:

### Method 1: URL Parameter

Add `?break-tests=true` to the URL:

```
http://localhost:4200/?break-tests=true
```

### Method 2: localStorage Setting

Open your browser console and run:

```javascript
localStorage.setItem('activate-test-breaker', 'true');
location.reload();
```

### Method 3: JavaScript API

Open your browser console and run:

```javascript
TestBreakerLoader.activate();
```

## Deactivating the Test Breaker

To deactivate the test breaker:

```javascript
TestBreakerLoader.deactivate();
location.reload();
```

## Running Tests with Broken App

To run Playwright tests against the broken application:

1. Start the server with the test breaker activated:
   ```
   npm run start
   ```

2. In a separate terminal, run the tests with the break-tests parameter:
   ```
   npx playwright test --headed -- --param=break-tests=true
   ```

## Debugging Tips

When tests fail due to the test breaker:

1. Check the browser console for messages starting with 🐞 to see what bugs were introduced
2. Use Playwright's trace viewer to analyze what happened during test execution
3. Try running the same test multiple times - the bugs are introduced randomly, so the failure patterns will vary

## Customizing Bug Probability

You can modify the `config` object at the top of `test-breaker.js` to adjust the probability of each type of bug being introduced.