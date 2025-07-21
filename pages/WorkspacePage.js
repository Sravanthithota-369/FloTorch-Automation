const BasePage = require('./BasePage');

/**
 * Workspace Page Object - Handles workspace management functionality
 */
class WorkspacePage extends BasePage {
  constructor(page) {
    super(page);
    
    // Workspace navigation selectors
    this.workspacesMenuSelectors = [
      'a[href*="/workspaces"]',
      'nav a:has-text("Workspaces")',
      '[data-testid="workspaces-menu"]',
      'text=Workspaces'
    ];
    
    // Create workspace button selectors
    this.createWorkspaceButtonSelectors = [
      'button:has-text("Create Workspace")',
      '[data-testid="create-workspace-btn"]',
      'button[class*="create"]',
      '.btn:has-text("Create")'
    ];
    
    // Input field selectors
    this.workspaceNameInputSelectors = [
      'input[name="name"]',
      '[data-testid="workspace-name-input"]',
      'input[placeholder*="name"]'
    ];

    this.workspaceDescriptionInputSelectors = [
      'textarea[name="description"]',
      'input[name="description"]',
      '[data-testid="workspace-description"]',
      'textarea[placeholder*="description"]'
    ];
    
    // Create workspace dialog selectors
    this.createWorkspaceDialogSelectors = [
      '[role="dialog"]',
      '.modal',
      '.workspace-modal',
      '[data-testid="create-workspace-modal"]'
    ];
    
    // Workspace name input selectors
    this.workspaceNameInputSelectors = [
      'input[name="name"]',
      'input[placeholder*="name"]',
      '[data-testid="workspace-name-input"]',
      '.modal input[type="text"]'
    ];
    
    // Workspace description input selectors
    this.workspaceDescriptionInputSelectors = [
      'textarea[name="description"]',
      'input[name="description"]',
      'textarea[placeholder*="description"]',
      '[data-testid="workspace-description-input"]'
    ];
    
    // Create button in dialog selectors
    this.createButtonSelectors = [
      'button:has-text("Create")',
      'button[type="submit"]:has-text("Create")',
      '.btn:has-text("Create")',
      '[data-testid="create-workspace-submit"]',
      '.modal button:has-text("Create")',
      'button.btn-primary',
      'input[type="submit"]',
      'button[class*="primary"]'
    ];
    
    // Toast notification selectors
    this.toastSelectors = [
      '.toast',
      '.notification',
      '.alert',
      '[role="alert"]',
      '.snackbar',
      '[data-testid="toast"]',
      '.toast-container',
      '.notification-container'
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
      'button[aria-label="Close"]',
      '.modal-close',
      'button:has-text("×")',
      '[data-testid="close-modal"]'
    ];
  }

  /**
   * Navigate to workspaces page
   */
  async navigateToWorkspaces() {
    await this.clickElement(this.workspacesMenuSelectors);
    await this.page.waitForLoadState('networkidle');
    console.log('Navigated to workspaces page');
  }

  /**
   * Click create workspace button
   */
  async clickCreateWorkspace() {
    await this.clickElement(this.createWorkspaceButtonSelectors);
    await this.page.waitForTimeout(300); // Wait for dialog to appear (reduced from 1000ms)
    console.log('Clicked create workspace button');
  }

  /**
   * Click on a specific workspace
   * @param {string} workspaceName - Name of the workspace to click
   */
  async clickWorkspace(workspaceName) {
    const workspaceSelectors = [
      `a:has-text("${workspaceName}")`,
      `[data-testid="workspace-${workspaceName}"]`,
      `div[role="button"]:has-text("${workspaceName}")`,
      `.workspace-card:has-text("${workspaceName}")`
    ];
    await this.clickElement(workspaceSelectors);
    await this.page.waitForLoadState('networkidle');
    console.log(`Clicked on workspace: ${workspaceName}`);
  }

  /**
   * Verify workspace dashboard is displayed
   * @param {string} workspaceName - Name of the workspace to verify
   * @returns {Promise<boolean>} - True if dashboard is displayed
   */
  async verifyWorkspaceDashboard(workspaceName) {
    const dashboardSelectors = [
      `[data-testid="workspace-dashboard-${workspaceName}"]`,
      `h1:has-text("${workspaceName}")`,
      `.workspace-header:has-text("${workspaceName}")`,
      `.dashboard-title:has-text("${workspaceName}")`
    ];

    for (const selector of dashboardSelectors) {
      try {
        await this.page.waitForSelector(selector, { timeout: 5000 });
        console.log(`Workspace dashboard verified with selector: ${selector}`);
        return true;
      } catch (error) {
        continue;
      }
    }
    return false;
  }

  /**
   * Fill workspace details
   * @param {string} name - Workspace name
   * @param {string} description - Workspace description (optional)
   */
  async fillWorkspaceDetails(name, description = '') {
    // Fill workspace name
    await this.fillInput(this.workspaceNameInputSelectors, name);
    console.log(`Filled workspace name: ${name}`);
    
    // Fill description if provided
    if (description) {
      await this.fillInput(this.workspaceDescriptionInputSelectors, description);
      console.log(`Filled workspace description: ${description}`);
    }
  }

  /**
   * Submit workspace creation
   */
  async submitWorkspaceCreation() {
    // First, let's try to find what buttons are available
    try {
      const allButtons = await this.page.$$('button');
      console.log(`Found ${allButtons.length} buttons on the page`);
      
      for (let i = 0; i < allButtons.length; i++) {
        const buttonText = await allButtons[i].textContent();
        const buttonClass = await allButtons[i].getAttribute('class');
        const buttonType = await allButtons[i].getAttribute('type');
        console.log(`Button ${i}: text="${buttonText}", class="${buttonClass}", type="${buttonType}"`);
      }
    } catch (error) {
      console.log('Could not enumerate buttons:', error.message);
    }
    
    await this.clickElement(this.createButtonSelectors);
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
  async captureToastNotifications() {
    const toasts = [];
    
    for (const selector of this.toastSelectors) {
      try {
        await this.page.waitForSelector(selector, { timeout: 3000 });
        const toastElements = await this.page.$$(selector);
        
        for (const toast of toastElements) {
          const text = await toast.textContent();
          if (text && text.trim()) {
            toasts.push(text.trim());
            console.log(`Toast notification captured: ${text.trim()}`);
          }
        }
        
        break; // If we found toasts with this selector, no need to try others
      } catch (error) {
        // Try next selector
        continue;
      }
    }
    
    if (toasts.length === 0) {
      console.log('No toast notifications found');
    }
    
    return toasts;
  }

  /**
   * Wait for and capture any toast notifications
   * @param {number} timeoutMs - How long to wait for toasts
   * @returns {Array} Array of toast messages
   */
  async waitForToastNotifications(timeoutMs = 5000) {
    console.log('Waiting for toast notifications...');
    
    try {
      // Wait for any toast to appear
      await this.page.waitForSelector(this.toastSelectors.join(', '), { timeout: timeoutMs });
      
      // Wait a bit more for all toasts to load (reduced from 1000ms)
      await this.page.waitForTimeout(500);
      
      return await this.captureToastNotifications();
    } catch (error) {
      console.log('No toast notifications appeared within timeout');
      return [];
    }
  }

  /**
   * Verify workspace exists in the list
   * @param {string} workspaceName - Name of the workspace to verify
   * @returns {boolean} True if workspace exists
   */
  async verifyWorkspaceExists(workspaceName) {
    try {
      // Try different approaches to find the workspace
      const workspaceSelectors = [
        `text=${workspaceName}`,
        `[data-workspace="${workspaceName}"]`,
        `.workspace-item:has-text("${workspaceName}")`,
        `tr:has-text("${workspaceName}")`
      ];
      
      for (const selector of workspaceSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 3000 });
          console.log(`Workspace "${workspaceName}" found in list`);
          return true;
        } catch (error) {
          continue;
        }
      }
      
      console.log(`Workspace "${workspaceName}" not found in list`);
      return false;
    } catch (error) {
      console.log(`Error verifying workspace existence: ${error.message}`);
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
