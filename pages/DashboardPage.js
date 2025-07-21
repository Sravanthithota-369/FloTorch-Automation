const BasePage = require('./BasePage');

/**
 * Dashboard Page Object class for Flotorch QA Console
 */
class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Common dashboard element selectors
    this.dashboardSelectors = [
      '[data-testid="dashboard"]',
      '.dashboard',
      '#dashboard',
      '.main-content',
      '.home',
      'main',
      '[role="main"]'
    ];

    this.headerSelectors = [
      'header',
      '.header',
      '.navbar',
      '.top-bar',
      '[data-testid="header"]'
    ];

    this.userMenuSelectors = [
      '.user-menu',
      '.profile-menu',
      '.account-menu',
      '[data-testid="user-menu"]',
      '.dropdown-toggle'
    ];

    this.logoutSelectors = [
      'button:has-text("Logout")',
      'button:has-text("Sign Out")',
      'a:has-text("Logout")',
      'a:has-text("Sign Out")',
      '[data-testid="logout"]',
      '.logout'
    ];
  }

  /**
   * Verify user is on dashboard page
   * @returns {Promise<boolean>} True if on dashboard, false otherwise
   */
  async isDashboardVisible() {
    console.log('Checking if dashboard is visible...');
    
    // Check for dashboard elements
    for (const selector of this.dashboardSelectors) {
      if (await this.isElementVisible(selector)) {
        console.log(`Dashboard found with selector: ${selector}`);
        return true;
      }
    }

    // Check for header elements (common in dashboards)
    for (const selector of this.headerSelectors) {
      if (await this.isElementVisible(selector)) {
        console.log(`Header found with selector: ${selector}`);
        return true;
      }
    }

    console.log('Dashboard not visible');
    return false;
  }

  /**
   * Get dashboard page title
   * @returns {Promise<string>} Page title
   */
  async getDashboardTitle() {
    return await this.page.title();
  }

  /**
   * Take dashboard screenshot
   */
  async takeDashboardScreenshot() {
    await this.takeScreenshot('dashboard-page.png');
  }

  /**
   * Verify dashboard page loaded successfully
   * @returns {Promise<boolean>} True if dashboard loaded successfully
   */
  async verifyDashboardLoaded() {
    console.log('Verifying dashboard page loaded...');
    
    //await this.wait(500);
    
    // Check if dashboard is visible
    //const isDashboard = await this.isDashboardVisible();
    
    // Get page title
    const title = await this.getDashboardTitle();
    console.log(`Page title: ${title}`);
    // Check if title contains "Dashboard" or similar
    if (title.toLowerCase().includes('dashboard') || title.toLowerCase().includes ('home')) {
      console.log('Dashboard page loaded successfully');
      return true;
    }
    // if (isDashboard) {
    //   console.log('Dashboard page loaded successfully');
    //   return true;
    // } else {
    //   console.log('Dashboard page did not load successfully');
    //   return false;
    // }
  }

  /**
   * Click logout button
   */
  async logout() {
    console.log('Attempting to logout...');
    
    try {
      // First try to find and click user menu if it exists
      for (const selector of this.userMenuSelectors) {
        if (await this.isElementVisible(selector)) {
          await this.clickElement(selector);
          console.log(`Clicked user menu with selector: ${selector}`);
          await this.wait(300); // Wait for menu to open (reduced from 1000ms)
          break;
        }
      }

      // Then click logout
      await this.clickElement(this.logoutSelectors);
      await this.waitForNavigation();
      console.log('Logout successful');
      
    } catch (error) {
      console.log('Logout failed or not available:', error.message);
      throw new Error('Could not find logout option');
    }
  }

  /**
   * Get user information if available
   * @returns {Promise<string|null>} User information or null
   */
  async getUserInfo() {
    const userInfoSelectors = [
      '.user-name',
      '.username',
      '.user-email',
      '[data-testid="user-info"]',
      '.profile-name'
    ];

    for (const selector of userInfoSelectors) {
      try {
        if (await this.isElementVisible(selector)) {
          const userInfo = await this.getElementText(selector);
          console.log(`User info found: ${userInfo}`);
          return userInfo;
        }
      } catch (error) {
        continue;
      }
    }

    console.log('No user information found');
    return null;
  }
}

module.exports = DashboardPage;
