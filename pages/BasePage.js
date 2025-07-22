const { expect } = require('@playwright/test');

/**
 * Base Page Object class that contains common methods for all page objects
 */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param {string} url - URL to navigate to
   */
  async navigateTo(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for an element to be visible
   * @param {string} selector - Element selector
   * @param {number} timeout - Timeout in milliseconds (default: 30000)
   */
  async waitForElement(selector, timeout = 30000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Click on an element using multiple selector strategies
   * @param {string|Array} selectors - Single selector or array of selectors to try
   */
  async clickElement(selectors) {
    const selectorArray = Array.isArray(selectors) ? selectors : [selectors];
    
    for (const selector of selectorArray) {
      try {
        await this.page.waitForSelector(selector, { timeout: 5000 });
        await this.page.click(selector);
        console.log(`Clicked element using selector: ${selector}`);
        return;
      } catch (error) {
        continue;
      }
    }
    throw new Error(`Could not find any clickable element with selectors: ${selectorArray.join(', ')}`);
  }

  /**
   * Fill input field using multiple selector strategies
   * @param {string|Array} selectors - Single selector or array of selectors to try
   * @param {string} text - Text to fill
   */
  async fillInput(selectors, text) {
    const selectorArray = Array.isArray(selectors) ? selectors : [selectors];
    
    for (const selector of selectorArray) {
      try {
        await this.page.waitForSelector(selector, { timeout: 5000 });
        await this.page.fill(selector, text);
        console.log(`Filled input using selector: ${selector}`);
        return;
      } catch (error) {
        continue;
      }
    }
    throw new Error(`Could not find any input field with selectors: ${selectorArray.join(', ')}`);
  }

  /**
   * Get text content from an element
   * @param {string} selector - Element selector
   * @returns {Promise<string>} Text content
   */
  async getElementText(selector) {
    await this.waitForElement(selector);
    return await this.page.textContent(selector);
  }

  /**
   * Check if element is visible using multiple selector strategies
   * @param {string|Array} selectors - Single selector or array of selectors to try
   * @returns {Promise<boolean>} True if any matching element is visible, false otherwise
   */
  async isElementVisible(selectors) {
    const selectorArray = Array.isArray(selectors) ? selectors : [selectors];
    
    for (const selector of selectorArray) {
      try {
        await this.page.waitForSelector(selector, { timeout: 5000 });
      } catch (error) {
        console.log(`No visible elements found with selectors: ${selector}`);
        continue;
      }
      return true;
    }
    return false;
  }

  /**
   * Check if a success notification is visible
   * @returns {Promise<boolean>} True if success notification is visible
   */
  async isSuccessNotificationVisible() {
    const successNotificationSelectors = [
      '.toast-success',
      '[data-testid="success-toast"]',
      '[role="alert"]',
      '.notification-success',
      '.Toastify__toast--success'
    ];
    
    return await this.isElementVisible(successNotificationSelectors);
  }

  /**
   * Get text content of visible notifications
   * @returns {Promise<Array<string>>} Array of notification messages
   */
  async getNotificationText() {
    const notificationSelectors = [
      '.toast-message',
      '[data-testid="toast-message"]',
      '[role="alert"]',
      '.notification-text',
      '.Toastify__toast-body'
    ];

    const messages = [];
    for (const selector of notificationSelectors) {
      try {
        const elements = await this.page.$$(selector);
        for (const element of elements) {
          const text = await element.textContent();
          if (text) messages.push(text.trim());
        }
      } catch (error) {
        continue;
      }
    }
    return messages;
  }

  async isElementVisible(selectors) {
    const selectorArray = Array.isArray(selectors) ? selectors : [selectors];
    
    for (const selector of selectorArray) {
      try {
        await this.page.waitForSelector(selector, { timeout: 5000 });
        const isVisible = await this.page.isVisible(selector);
        if (isVisible) {
          console.log(`Element found and visible using selector: ${selector}`);
          return true;
        }
      } catch (error) {
        continue;
      }
    }
    console.log(`No visible elements found with selectors: ${selectorArray.join(', ')}`);
    return false;
  }

  /**
   * Take a screenshot with enhanced naming for Allure
   * @param {string} filename - Screenshot filename
   * @param {string} description - Description for Allure report
   */
  async takeScreenshot(filename, description = null) {
    try {
      const screenshotPath = `tests/screenshots/${filename}`;
      if (this.page && !this.page.isClosed()) {
        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.page.screenshot({ 
          path: screenshotPath, 
          fullPage: true 
        });
        console.log(`Screenshot saved: ${filename}`);
        
        // If description provided, this is for Allure reporting
        if (description) {
          const screenshotBuffer = await this.page.screenshot({ fullPage: true });
          return { buffer: screenshotBuffer, path: screenshotPath, description };
        }
      } else {
        console.log('Page is not available for screenshot');
      }
    } catch (error) {
      console.log(`Failed to take screenshot: ${error.message}`);
    }
  }

  /**
   * Take screenshot for Allure report attachment
   * @param {string} stepName - Name of the step for screenshot
   * @returns {string} Screenshot file path for Allure attachment
   */
  async captureScreenshotForAllure(stepName) {
    try {
      const timestamp = Date.now();
      const sanitizedStepName = stepName.replace(/[^a-zA-Z0-9]/g, '_');
      const screenshotPath = `allure-results/screenshots/${sanitizedStepName}-${timestamp}.png`;
      
      await this.page.screenshot({ 
        path: screenshotPath,
        fullPage: true,
        type: 'png'
      });
      
      console.log(`Screenshot captured for step: ${stepName} -> ${screenshotPath}`);
      return screenshotPath;
    } catch (error) {
      console.log(`Failed to capture screenshot for ${stepName}:`, error.message);
      return null;
    }
  }

  /**
   * Get current page URL
   * @returns {string} Current URL
   */
  getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for a specific amount of time
   * @param {number} milliseconds - Time to wait in milliseconds
   */
  async wait(milliseconds) {
    await this.page.waitForTimeout(milliseconds);
  }
}

module.exports = BasePage;
