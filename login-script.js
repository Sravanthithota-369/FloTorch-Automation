const { chromium } = require('@playwright/test');

async function loginToConsole() {
  // Launch browser in headed mode so you can see what's happening
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // Slow down actions by 1 second for better visibility
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('Navigating to the login page...');
    await page.goto('https://qa-console.flotorch.cloud/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot of the login page
    await page.screenshot({ path: 'login-page.png', fullPage: true });
    console.log('Screenshot saved as login-page.png');
    
    console.log('Looking for login form elements...');
    
    // Try to find and fill email field
    const emailSelectors = [
      'input[type="email"]',
      'input[name="email"]', 
      'input[name="username"]',
      'input[placeholder*="email" i]',
      'input[id*="email" i]',
      'input[id*="username" i]'
    ];
    
    let emailField = null;
    for (const selector of emailSelectors) {
      try {
        emailField = await page.waitForSelector(selector, { timeout: 2000 });
        if (emailField) {
          console.log(`Found email field with selector: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (emailField) {
      // Find the working selector and use it
      let workingEmailSelector = null;
      for (const selector of emailSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 2000 });
          workingEmailSelector = selector;
          break;
        } catch (e) {
          continue;
        }
      }
      if (workingEmailSelector) {
        await page.fill(workingEmailSelector, 'sravanthi.thota+1992@fissionlabs.com');
        console.log('Email filled successfully');
      }
    } else {
      console.log('Could not find email field. Let me try to wait for form to load...');
      await page.waitForTimeout(3000);
      
      // Try again after waiting
      for (const selector of emailSelectors) {
        try {
          emailField = await page.$(selector);
          if (emailField) {
            await page.fill(selector, 'sravanthi.thota+1992@fissionlabs.com');
            console.log(`Email filled with selector: ${selector}`);
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }
    
    // Try to find and fill password field
    const passwordSelectors = [
      'input[type="password"]',
      'input[name="password"]',
      'input[placeholder*="password" i]',
      'input[id*="password" i]'
    ];
    
    let passwordField = null;
    for (const selector of passwordSelectors) {
      try {
        passwordField = await page.waitForSelector(selector, { timeout: 2000 });
        if (passwordField) {
          console.log(`Found password field with selector: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (passwordField) {
      // Find the working selector and use it
      let workingPasswordSelector = null;
      for (const selector of passwordSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 2000 });
          workingPasswordSelector = selector;
          break;
        } catch (e) {
          continue;
        }
      }
      if (workingPasswordSelector) {
        await page.fill(workingPasswordSelector, 'Havisha@119');
        console.log('Password filled successfully');
      }
    } else {
      console.log('Could not find password field');
    }
    
    // Try to find and click login button
    const buttonSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:has-text("Login")',
      'button:has-text("Sign In")',
      'button:has-text("Log In")',
      'button:has-text("Submit")',
      '.login-btn',
      '.submit-btn'
    ];
    
    let loginButton = null;
    for (const selector of buttonSelectors) {
      try {
        loginButton = await page.waitForSelector(selector, { timeout: 2000 });
        if (loginButton) {
          console.log(`Found login button with selector: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (loginButton) {
      console.log('Clicking login button...');
      // Find the working selector and use it
      let workingButtonSelector = null;
      for (const selector of buttonSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 2000 });
          workingButtonSelector = selector;
          break;
        } catch (e) {
          continue;
        }
      }
      if (workingButtonSelector) {
        await page.click(workingButtonSelector);
      }
      
      // Wait for navigation or response
      await page.waitForTimeout(5000);
      
      // Take screenshot after login attempt
      await page.screenshot({ path: 'after-login.png', fullPage: true });
      console.log('Screenshot saved as after-login.png');
      
      console.log('Current URL:', page.url());
      
    } else {
      console.log('Could not find login button');
    }
    
    // Keep browser open for manual inspection
    console.log('Login process completed. Browser will stay open for 30 seconds for inspection...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('Error during login:', error);
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

// Run the login function
loginToConsole().catch(console.error);
