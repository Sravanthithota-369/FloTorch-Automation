const BasePage = require('./BasePage');

class ModelsPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Page verification selectors
    this.modelsPageSelectors = [
      'h1:has-text("Models")',
      '[data-testid="models-page"]', 
      '.page-heading:has-text("Models")',
      'div.page-title:has-text("Models")',
      // Additional selectors
      '.models-table',
      '.models-list',
      '.model-grid',
      '#models-container',
      'button:has-text("New Model")',
      'button:has-text("Add Model")',
      '.heading:has-text("Models")',
      'text=Models',
      '.breadcrumb:has-text("Models")'
    ];
    
    // Action button selectors
    this.newModelButtonSelectors = [
      'button:has-text("New Model")',
      '[data-testid="new-model-button"]',
      '.new-model-btn',
      '#add-model-btn',
      'button.primary:has-text("New Model")'
    ];
    
    // Navigation menu selectors
    this.modelsMenuSelectors = [
      'button:has-text("Model Registry")',
      '[data-testid="model-registry-menu"]',
      '.nav-item:has-text("Model Registry")'
    ];

    this.modelsSubmenuSelectors = [
      // Role-based selectors
      'a[role="menuitem"]:has-text("Models")',
      '[role="menu"] >> text=Models',
      // Data attribute based selectors
      '[data-testid="models-submenu"]',
      '[data-menu-item="models"]',
      // General selectors
      '.submenu-item:has-text("Models")',
      'a:has-text("Models")',
      // Additional selectors based on common patterns
      'li:has-text("Models")',
      '.nav-item:has-text("Models")',
      '.dropdown-item:has-text("Models")'
    ];

    this.providersSubmenuSelectors = [
      // Role-based selectors
      'a[role="menuitem"]:has-text("Providers")',
      '[role="menu"] >> text=Providers',
      // Data attribute based selectors
      '[data-testid="providers-submenu"]',
      '[data-menu-item="providers"]',
      // General selectors
      '.submenu-item:has-text("Providers")',
      'a:has-text("Providers")',
      // Additional selectors based on common patterns
      'li:has-text("Providers")',
      '.nav-item:has-text("Providers")',
      '.dropdown-item:has-text("Providers")'
    ];
  }

  async isModelsSubmenuVisible() {
    return await this.isElementVisible(this.modelsSubmenuSelectors);
  }

  async isProvidersSubmenuVisible() {
    return await this.isElementVisible(this.providersSubmenuSelectors);
  }

  // Action buttons selectors
  actionsMenuButtonSelectors = [
    'button:has-text("⋮")',
    '[data-testid="actions-menu"]',
    '.model-actions button',
    '//button[contains(@class, "actions-menu")]',
    'button.more-actions'
  ];

  publishLatestOptionSelectors = [
    'text=Publish Latest',
    '[data-testid="publish-latest-option"]',
    '.publish-latest-action'
  ];

  versionDropdownSelectors = [
    'text=Select a published version',
    '[placeholder="Select a published version"]',
    '.version-select'
  ];

  publishButtonInDialogSelectors = [
    'button:has-text("Publish")',
    '[data-testid="confirm-publish-button"]',
    '.publish-dialog-confirm'
  ];

  async clickActionsMenuButton() {
    await this.clickElement(this.actionsMenuButtonSelectors);
  }

  async clickPublishLatestOption() {
    await this.clickElement(this.publishLatestOptionSelectors);
  }

  async selectVersionFromDropdown(version) {
    await this.clickElement(this.versionDropdownSelectors);
    const versionOptionSelector = `text=${version}`;
    await this.clickElement([versionOptionSelector]);
  }

  async clickPublishButtonInDialog() {
    await this.clickElement(this.publishButtonInDialogSelectors);
  }

  async verifyOnModelsPage() {
    return await this.isElementVisible(this.modelsPageSelectors);
  }

  async clickNewModel() {
    await this.clickElement(this.newModelButtonSelectors);
  }

  async isModelPublishSuccessNotificationVisible() {
    const notificationSelectors = [
      'text=Model published successfully',
      '[data-testid="success-notification"]',
      '.success-toast:has-text("published")'
    ];
    return await this.isElementVisible(notificationSelectors);
  }

  async captureModelRegistryDropdown(screenshotName) {
    await this.page.screenshot({
      path: `./tests/screenshots/${screenshotName}.png`,
      fullPage: false
    });
  }

  /**
   * Navigate to the Models submenu
   */
  async navigateToModels() {
    // Click on Models submenu
    await this.clickElement(this.modelsSubmenuSelectors);
    
    // Wait for navigation and page load
    await this.page.waitForLoadState('networkidle');
    
    // Verify we're on the models page
    const currentUrl = this.page.url();
    const isOnModelsPage = currentUrl.includes('/models') || currentUrl.includes('/registry');
    console.log(`Current URL: ${currentUrl}, On models page: ${isOnModelsPage}`);
    
    if (!isOnModelsPage) {
      throw new Error('Failed to navigate to Models page');
    }
  }

  /**
   * Verify if on models page
   * @returns {Promise<boolean>}
   */
  async isOnModelsPage() {
    const url = this.page.url();
    return url.includes('/models') || url.includes('/registry');
  }

  // Model form field selectors
  modelFormSelectors = {
    name: [
      'input[placeholder="Enter model name"]',
      '[data-testid="model-name-input"]',
      '#model-name',
      'input[name="modelName"]',
      'input[name="name"]',
      '.model-name input',
      'input[type="text"]',
      '[aria-label="Model name"]',
      'input.model-name',
      'input[placeholder*="name"]',
      'input:not([type="hidden"])'
    ],
    description: [
      'input[name="description"]',
      'textarea[placeholder="Enter model description"]', 
      '[data-testid="model-description-input"]',
      '#model-description',
      'textarea[name="modelDescription"]',
      'textarea[name="description"]',
      '.model-description textarea',
      'textarea',
      '[aria-label="Model description"]',
      'textarea.model-description',
      'textarea[placeholder*="description"]',
      'div[role="textbox"]'
    ]
  };

  /**
   * Fill in the model creation form
   * @param {Object} modelData - Object containing model data (name, description)
   */
  async fillModelDetails(modelData) {
    const { name, description } = modelData;
    console.log('Starting to fill model details form...');

    try {
      if (name) {
        console.log('Filling model name:', name);
        // Wait for name field to be ready
        await this.page.waitForSelector(this.modelFormSelectors.name.join(', '), { state: 'visible', timeout: 5000 });
        await this.fillInput(this.modelFormSelectors.name, name);
        console.log('Successfully filled model name');
        
        // Take screenshot and log DOM after filling name
        await this.page.screenshot({ path: 'after-name-field.png' });
        const formHTML = await this.page.evaluate(() => {
          const form = document.querySelector('form');
          return form ? form.outerHTML : 'No form found';
        });
        console.log('Form HTML after filling name:', formHTML);
      }

      if (description) {
        console.log('Filling model description:', description);
        // Take screenshot before attempting to fill description
        await this.page.screenshot({ path: 'before-description.png' });
        console.log('Attempting to find description field with selectors:', this.modelFormSelectors.description);
        
        // Try each selector individually with increased timeout
        for (const selector of this.modelFormSelectors.description) {
          try {
            console.log('Trying selector:', selector);
            const element = await this.page.waitForSelector(selector, { state: 'visible', timeout: 10000 });
            if (element) {
              console.log('Found description field with selector:', selector);
              await this.fillInput([selector], description);
              console.log('Successfully filled model description');
              return;
            }
          } catch (e) {
            console.log('Selector failed:', selector, e.message);
          }
        }
        
        // If we get here, none of the selectors worked
        throw new Error('Could not find description field with any selector');
      }

      // Verify the filled values
      const filledName = await this.page.inputValue(this.modelFormSelectors.name[0]).catch(() => null);
      if (filledName !== name) {
        console.warn(`Model name verification failed. Expected: ${name}, Got: ${filledName}`);
      }

      console.log('Completed filling model details form');
    } catch (error) {
      console.error('Error filling model details:', error.message);
      throw error;
    }
  }

  // Create button selectors
  createButtonSelectors = [
    'button:has-text("Create")',
    '[data-testid="create-model-button"]',
    '.create-model-btn',
    '#create-model-btn',
    'button[type="submit"]',
    'button.primary:has-text("Create")'
  ];

  /**
   * Click the Create button
   */
  async clickCreateButton() {
    await this.clickElement(this.createButtonSelectors);
  }
}

module.exports = ModelsPage;
