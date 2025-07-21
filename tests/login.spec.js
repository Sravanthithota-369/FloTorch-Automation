const { test, expect } = require('@playwright/test');

test.describe('Flotorch Console Login', () => {
  test('Login to QA Console', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://qa-console.flotorch.cloud/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Fill in the username
    await page.fill('input[type="email"], input[name="email"], input[name="username"]', 'sravanthi.thota+1992@fissionlabs.com');
    
    // Fill in the password
    await page.fill('input[type="password"], input[name="password"]', 'Havisha@119');
    
    // Click the login button
    await page.click('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    
    // Wait for navigation after login
    await page.waitForLoadState('networkidle');
    
    // Verify successful login by checking for dashboard elements or URL change
    // You may need to adjust these assertions based on the actual page after login
    await expect(page).not.toHaveURL('https://qa-console.flotorch.cloud/');
    
    // Take a screenshot for verification
    await page.screenshot({ path: 'tests/screenshots/after-login.png', fullPage: true });
    
    console.log('Login successful!');
  });
});
