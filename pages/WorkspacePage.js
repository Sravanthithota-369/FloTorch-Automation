const BasePage = require('./BasePage');

/**
 * Workspace Page Object - Handles workspace management functionality
 */
class WorkspacePage extends BasePage {
  constructor(page) {
    super(page);
    
    // Workspace navigation selectors
    this.workspacesMenuSelectors = [
      'a[href*="/admin/workspaces"]'
    ];
    
    this.createWorkspaceButtonSelectors = [
      '//span[text()="Create Workspace"]//ancestor::button'
    ];
    
    this.createWorkspaceDialogSelectors = [
      '[role="dialog"]',
      '.modal',
      '.workspace-modal',
      '[data-testid="create-workspace-modal"]'
    ];
    
    // Workspace name input selectors
    this.workspaceNameInputSelectors = [
      'input[name="name"]'
    ];
    
    // Workspace description input selectors
    this.workspaceDescriptionInputSelectors = [
      'input[name="description"]'
    ];
    
    // Create button in dialog selectors
    this.createButtonSelectors = [
      'button[type="submit"]',
    ];
    
    // Toast notification selectors
    this.toastSelectors = [
      '//li//div[contains(@class,"text-sm text-muted break-keep")]'
    ];
    
    // Workspace list selectors
    this.workspaceListSelectors = [
      '.workspace-item',
      '[data-testid="workspace-item"]',
      'tr[data-workspace]',
      '.workspace-row'
    ];
    
    // Close dialog selectors
    this.closeDialogSelectors = [
      'button[aria-label="Close"]'
    ];
  }

  /**
   * Navigate to workspaces page
   */
  async navigateToWorkspaces() {
    await this.clickElement(this.workspacesMenuSelectors);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);
    console.log('Navigated to workspaces page');
  }

  /**
   * Click create workspace button
   */
  async clickCreateWorkspace() {
    await this.clickElement(this.createWorkspaceButtonSelectors);
    await this.page.waitForTimeout(3000); // Increased wait time for dialog animation
    console.log('Clicked create workspace button');
  }

  /**
   * Click on a specific workspace
   * @param {string} workspaceName - Name of the workspace to click
   */
  async clickWorkspace(workspaceName) {
    const workspaceSelectors = [
      `[data-testid="${workspaceName}"]`,
      `a[href*="${workspaceName}"]`,
      `a:has-text("${workspaceName}")`,
      `text=${workspaceName}`,
      `.workspace-item:has-text("${workspaceName}")`,
      `//a[contains(normalize-space(),'${workspaceName}')]`,
      `//a[contains(.,'${workspaceName}')]`,
      `//tr[contains(.,'${workspaceName}')]//a`,
      `//div[contains(@class,'workspace')]//a[contains(.,'${workspaceName}')]`
    ];
    
    console.log(`Attempting to click workspace: ${workspaceName}`);
    
    // Wait for page to be stable
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(500); // Brief pause for any animations
    
    // Try each selector
    for (const selector of workspaceSelectors) {
      try {
        await this.page.waitForSelector(selector, { timeout: 2000, state: 'visible' });
        await this.page.click(selector);
        console.log(`Clicked workspace using selector: ${selector}`);
        await this.page.waitForLoadState('networkidle');
        return;
      } catch (error) {
        console.log(`Failed to click with selector ${selector}: ${error.message}`);
        continue;
      }
    }
    
    throw new Error(`Could not find clickable workspace: ${workspaceName}`);
  }

  /**
   * Verify workspace dashboard is displayed
   * @param {string} workspaceName - Name of the workspace to verify
   * @returns {Promise<boolean>} - True if dashboard is displayed
   */
  async verifyWorkspaceDashboard(workspaceName) {
    const selector = `//h1[contains(text(),'${workspaceName}')]`;
    try {
      await this.page.waitForSelector(selector, { timeout: 2000 });
      if (await this.isElementVisible(selector)) {
        console.log(`Workspace dashboard is visible with: ${workspaceName}`);
        return true;
      }
      console.warn(`Element found but not visible for workspace: ${workspaceName}`);
      return false;
    } catch (error) {
      console.warn(`Workspace dashboard not found for: ${workspaceName}`);
      return false;
    }
  }

  /**
   * Fill workspace details
   * @param {string} name - Workspace name
   * @param {string} description - Workspace description (optional)
   */
  async fillWorkspaceDetails(name, description = '') {
    // Fill workspace name
    await this.fillInput(this.workspaceNameInputSelectors[0], name);
    console.log(`Filled workspace name: ${name}`);
    
    // Fill description if provided
    if (description) {
      await this.fillInput(this.workspaceDescriptionInputSelectors[0], description);
      console.log(`Filled workspace description: ${description}`);
    }
  }

  /**
   * Submit workspace creation
   */
  async submitWorkspaceCreation() {
    
    await this.clickElement(this.createButtonSelectors[0]);
    console.log('Submitted workspace creation');
  }

  /**
   * Create a new workspace
   * @param {string} name - Workspace name
   * @param {string} description - Workspace description (optional)
   */
  async createWorkspace(name, description = '') {
    await this.clickCreateWorkspace();
    await this.fillWorkspaceDetails(name, description);
    await this.submitWorkspaceCreation();
    
    // Wait for creation to complete (reduced from 2000ms)
    await this.page.waitForTimeout(500);
    console.log(`Workspace creation initiated: ${name}`);
  }

  /**
   * Check for toast notifications
   * @returns {Array} Array of toast messages
   */
  async captureToastNotifications(expectedText) {
  try {
    await this.page.waitForSelector(this.toastSelectors, { timeout: 3000 });
    const toast = await this.page.$(this.toastSelectors);

    if (toast) {
      const text = await toast.textContent();
      if (text && text.trim() === expectedText) {
        console.log(`Toast notification captured successfully: ${text.trim()}`);
      }
      return [text.trim()];
    }
    return [];
  } catch (error) {
    console.warn(`Failed to capture toast notification: ${error.message}`);
    return [];
  }
  }

  /**
   * Verify workspace exists in the list
   * @param {string} workspaceName - Name of the workspace to verify
   * @returns {boolean} True if workspace exists
   */
  async verifyWorkspaceExists(workspaceName) {

      const workspaceSelectors = [
        `//span[text()='${workspaceName}']`,
      ];
      
        try {
          await this.page.waitForSelector(workspaceSelectors, { timeout: 2000 });

          if( await this.isElementVisible(workspaceSelectors)) {
          console.log(`Workspace "${workspaceName}" found in list`);
          return true;
          }
      } catch (error) {
        console.warn(`Workspace "${workspaceName}" not found in list: ${error.message}`);
        return false;
      }
  }

  /**
   * Close create workspace dialog
   */
  async closeCreateWorkspaceDialog() {
    try {
      await this.clickElement(this.closeDialogSelectors);
      console.log('Closed create workspace dialog');
    } catch (error) {
      console.log('Could not close dialog or dialog already closed');
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
   * Verify we are on workspaces page
   * @returns {boolean} True if on workspaces page
   */
  async verifyOnWorkspacesPage() {
    const currentUrl = this.getCurrentUrl();
    const isOnWorkspacesPage = currentUrl.includes('/workspaces') || currentUrl.includes('/admin/workspaces');
    console.log(`Current URL: ${currentUrl}, On workspaces page: ${isOnWorkspacesPage}`);
    return isOnWorkspacesPage;
  }

  /**
   * Take screenshot with workspace context
   * @param {string} stepName - Name of the step for screenshot
   * @returns {string} Screenshot file path
   */
  async captureWorkspaceScreenshot(stepName) {
    return await this.captureScreenshotForAllure(`Workspace_${stepName}`);
  }

  /**
   * Get text from success notifications
   * @returns {Promise<string[]>} Array of notification texts
   */
  async getNotificationText() {
    const toastTextSelectors = [
     
      '.toast:has-text("successfully")',
      '.toast .message',
      '.toast-message',
      '.notification-message',
      '.alert-text',
      '[role="alert"] p',
      '.snackbar-message',
      '.toast-container .message',
      '.notification-container .message',
      '[role="alert"]',
      '.toast-text',
      '.success-message',
      // Additional selectors for toast text
      '.toast-body',
      '.Toastify__toast-body',  
      '.toast-content',
      '.notification-content',
      '[role="alert"] div',
      '.toastBody',
      '.toast--message',
      '.toast__message',
      // More specific matches
      '[data-testid="toast-message"]',
      '[data-testid="notification-message"]',
      '[data-testid="success-message"]',
      // Full toast containers
      '.Toastify__toast',
      '.toast',
      '.notification',
      '.alert'
    ];

    const messages = [];
    for (const selector of toastTextSelectors) {
      try {
        // Wait for and get all matching elements
        await this.page.waitForSelector(selector, { timeout: 500 });
        const elements = await this.page.$$(selector);
        
        // Get text from each element
        for (const element of elements) {
          const text = await element.textContent();
          if (text && text.trim()) {
            messages.push(text.trim());
          }
        }
        
        if (messages.length > 0) {
          break; // Found messages with this selector, stop trying others
        }
      } catch (error) {
        // Try next selector
        continue;
      }
    }

    return messages;
  }
}

module.exports = WorkspacePage;
