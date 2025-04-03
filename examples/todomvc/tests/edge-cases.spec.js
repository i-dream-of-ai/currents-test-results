// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('TodoMVC Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the TodoMVC app before each test
    await page.goto('/');
  });

  test('should not add empty todos', async ({ page }) => {
    // Try to add an empty todo
    await page.locator('.new-todo').fill('  ');
    await page.locator('.new-todo').press('Enter');
    
    // Verify no todo was added
    await expect(page.locator('.todo-list li')).toHaveCount(0);
  });

  test('should handle special characters in todos', async ({ page }) => {
    // Add a todo with special characters
    const specialTodo = '!@#$%^&*()_+<>?:"{}|';
    await page.locator('.new-todo').fill(specialTodo);
    await page.locator('.new-todo').press('Enter');
    
    // Verify the todo was added correctly
    await expect(page.locator('.todo-list li label')).toHaveText(specialTodo);
  });

  test('should handle very long todo text', async ({ page }) => {
    // Create a very long todo text
    const longText = 'This is a very long todo item that exceeds the typical length of a todo item and tests how the application handles long text inputs without breaking the layout or functionality of the application.';
    
    // Add the long todo
    await page.locator('.new-todo').fill(longText);
    await page.locator('.new-todo').press('Enter');
    
    // Verify the todo was added correctly
    await expect(page.locator('.todo-list li label')).toHaveText(longText);
  });

  test('should handle marking all todos as completed', async ({ page }) => {
    // Add multiple todos
    const todos = ['Task 1', 'Task 2', 'Task 3'];
    for (const todo of todos) {
      await page.locator('.new-todo').fill(todo);
      await page.locator('.new-todo').press('Enter');
    }
    
    // Verify all todos were added
    await expect(page.locator('.todo-list li')).toHaveCount(todos.length);
    
    // Toggle all todos as completed
    await page.locator('.toggle-all').click();
    
    // Verify all todos are marked as completed
    for (let i = 0; i < todos.length; i++) {
      await expect(page.locator('.todo-list li').nth(i)).toHaveClass(/completed/);
    }
    
    // Toggle all todos back to active
    await page.locator('.toggle-all').click();
    
    // Verify all todos are marked as active
    for (let i = 0; i < todos.length; i++) {
      await expect(page.locator('.todo-list li').nth(i)).not.toHaveClass(/completed/);
    }
  });

  test('should cancel editing when escape is pressed', async ({ page }) => {
    // Add a todo
    await page.locator('.new-todo').fill('Original task');
    await page.locator('.new-todo').press('Enter');
    
    // Double-click to edit
    await page.locator('.todo-list li label').dblclick();
    
    // Change the text but press Escape
    await page.locator('.todo-list li .edit').fill('Changed task');
    await page.locator('.todo-list li .edit').press('Escape');
    
    // Verify the todo text remains unchanged
    await expect(page.locator('.todo-list li label')).toHaveText('Original task');
  });

  test('should trim whitespace from entered text', async ({ page }) => {
    // Add a todo with leading and trailing whitespace
    await page.locator('.new-todo').fill('  Trim this text  ');
    await page.locator('.new-todo').press('Enter');
    
    // Verify the todo text is trimmed
    await expect(page.locator('.todo-list li label')).toHaveText('Trim this text');
  });
});