const BasePage = require('./BasePage');

/**
 * Login Page Object class for Flotorch QA Console
 */
class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Page URL
    this.url = 'https://qa-console.flotorch.cloud/';
    
    // Element selectors with multiple fallback options
    this.emailSelectors = [
      'input[type="email"]',
      'input[name="email"]',
      'input[name="username"]',
      'input[placeholder*="email" i]',
      'input[placeholder*="username" i]',
      '#email',
      '#username',
      '.email',
      '.username'
    ];
    
    this.passwordSelectors = [
      'input[type="password"]',
      'input[name="password"]',
      'input[placeholder*="password" i]',
      '#password',
      '.password'
    ];
    
    this.loginButtonSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:has-text("Login")',
      'button:has-text("Sign In")',
      'button:has-text("Log In")',
      'button:has-text("Submit")',
      '.login-button',
      '.submit-button',
      '#login-button',
      '#submit'
    ];

    // Error message selectors
    this.errorMessageSelectors = [
      '.error-message',
      '.alert-danger',
      '.error',
      '[data-testid="error"]',
      '.text-danger'
    ];
  }

  /**
   * Navigate to the login page
   */
  async navigateToLoginPage() {
    console.log(`Navigating to login page: ${this.url}`);
    await this.navigateTo(this.url);
    await this.takeScreenshot('login-page.png', 'Login Page Loaded');
  }

  /**
   * Enter email/username
   * @param {string} email - Email address to enter
   */
  async enterEmail(email) {
    console.log(`Entering email: ${email}`);
    await this.fillInput(this.emailSelectors, email);
  }

  /**
   * Enter password
   * @param {string} password - Password to enter
   */
  async enterPassword(password) {
    console.log('Entering password');
    await this.fillInput(this.passwordSelectors, password);
  }

  /**
   * Click the login button
   */
  async clickLoginButton() {
    console.log('Clicking login button');
    await this.clickElement(this.loginButtonSelectors);
  }

  /**
   * Perform complete login process
   * @param {string} email - Email address
   * @param {string} password - Password
   */
  async login(email, password) {
    await this.navigateToLoginPage();
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginButton();
    await this.waitForNavigation();
    await this.takeScreenshot('after-login.png');
  }

  /**
   * Check if login was successful
   * @returns {Promise<boolean>} True if login successful, false otherwise
   */
  async isLoginSuccessful() {
    // Wait a moment for any redirects
    await this.wait(3000);
    
    const currentUrl = this.getCurrentUrl();
    const isNotOnLoginPage = currentUrl !== this.url && !currentUrl.includes('login');
    
    if (isNotOnLoginPage) {
      console.log(`Login successful! Redirected to: ${currentUrl}`);
      return true;
    } else {
      console.log(`Login failed or still on login page: ${currentUrl}`);
      return false;
    }
  }

  /**
   * Get error message if login failed
   * @returns {Promise<string|null>} Error message or null if no error
   */
  async getErrorMessage() {
    for (const selector of this.errorMessageSelectors) {
      try {
        if (await this.isElementVisible(selector)) {
          const errorText = await this.getElementText(selector);
          console.log(`Error message found: ${errorText}`);
          return errorText;
        }
      } catch (error) {
        continue;
      }
    }
    return null;
  }

  /**
   * Verify login page elements are present
   * @returns {Promise<boolean>} True if all elements are present
   */
  async verifyLoginPageElements() {
    console.log('Verifying login page elements...');
    
    let emailVisible = false;
    let passwordVisible = false;
    let buttonVisible = false;

    // Check email field
    for (const selector of this.emailSelectors) {
      if (await this.isElementVisible(selector)) {
        emailVisible = true;
        console.log(`Email field found with selector: ${selector}`);
        break;
      }
    }

    // Check password field
    for (const selector of this.passwordSelectors) {
      if (await this.isElementVisible(selector)) {
        passwordVisible = true;
        console.log(`Password field found with selector: ${selector}`);
        break;
      }
    }

    // Check login button
    for (const selector of this.loginButtonSelectors) {
      if (await this.isElementVisible(selector)) {
        buttonVisible = true;
        console.log(`Login button found with selector: ${selector}`);
        break;
      }
    }

    const allElementsPresent = emailVisible && passwordVisible && buttonVisible;
    console.log(`Login page elements verification: ${allElementsPresent ? 'PASSED' : 'FAILED'}`);
    
    return allElementsPresent;
  }
}

module.exports = LoginPage;
