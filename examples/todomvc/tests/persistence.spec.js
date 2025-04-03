// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('TodoMVC Persistence', () => {
  test('should persist todos after page reload', async ({ page }) => {
    // Navigate to the TodoMVC app
    await page.goto('/');
    
    // Add a new todo item
    await page.locator('.new-todo').fill('Persistent todo');
    await page.locator('.new-todo').press('Enter');
    
    // Verify the todo was added
    await expect(page.locator('.todo-list li')).toHaveCount(1);
    await expect(page.locator('.todo-list li label')).toHaveText('Persistent todo');
    
    // Reload the page
    await page.reload();
    
    // Verify the todo still exists after reload
    await expect(page.locator('.todo-list li')).toHaveCount(1);
    await expect(page.locator('.todo-list li label')).toHaveText('Persistent todo');
  });

  test('should persist completed status after page reload', async ({ page }) => {
    // Navigate to the TodoMVC app
    await page.goto('/');
    
    // Add a new todo item
    await page.locator('.new-todo').fill('Complete and persist');
    await page.locator('.new-todo').press('Enter');
    
    // Mark the todo as completed
    await page.locator('.todo-list li .toggle').click();
    
    // Verify the todo is marked as completed
    await expect(page.locator('.todo-list li')).toHaveClass(/completed/);
    
    // Reload the page
    await page.reload();
    
    // Verify the todo is still marked as completed
    await expect(page.locator('.todo-list li')).toHaveClass(/completed/);
  });

  test('should maintain filter state after page reload', async ({ page }) => {
    // Navigate to the TodoMVC app
    await page.goto('/');
    
    // Add two todo items
    await page.locator('.new-todo').fill('Active task');
    await page.locator('.new-todo').press('Enter');
    await page.locator('.new-todo').fill('Task to complete');
    await page.locator('.new-todo').press('Enter');
    
    // Mark the second todo as completed
    await page.locator('.todo-list li').nth(1).locator('.toggle').click();
    
    // Filter by active
    await page.locator('a[href="#/active"]').click();
    
    // Verify only active todo is visible
    await expect(page.locator('.todo-list li')).toHaveCount(1);
    await expect(page.locator('.todo-list li label')).toHaveText('Active task');
    
    // Reload the page
    await page.reload();
    
    // Verify filter state is maintained and only active todo is visible
    await expect(page.locator('.todo-list li')).toHaveCount(1);
    await expect(page.locator('.todo-list li label')).toHaveText('Active task');
    
    // Change filter to completed
    await page.locator('a[href="#/completed"]').click();
    
    // Verify only completed todo is visible
    await expect(page.locator('.todo-list li')).toHaveCount(1);
    await expect(page.locator('.todo-list li label')).toHaveText('Task to complete');
    
    // Reload the page
    await page.reload();
    
    // Verify filter state is maintained and only completed todo is visible
    await expect(page.locator('.todo-list li')).toHaveCount(1);
    await expect(page.locator('.todo-list li label')).toHaveText('Task to complete');
  });
});