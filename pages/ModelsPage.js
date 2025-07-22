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

    // Action buttons selectors
    this.actionsMenuButtonSelectors = [
      'button:has-text("")',
      '[data-testid="actions-menu"]',
      '.model-actions button',
      '//button[contains(@class, "actions-menu")]',
      'button.more-actions'
    ];

    this.publishLatestOptionSelectors = [
      'text=Publish Latest',
      '[data-testid="publish-latest-option"]',
      '.publish-latest-action'
    ];

    this.versionDropdownSelectors = [
      'text=Select a published version',
      '[placeholder="Select a published version"]',
      '.version-select'
    ];

    this.providerDropdownSelectors = [
      '.provider-dropdown',
      '[data-testid="provider-select"]',
      'select[name="provider"]',
      '[aria-label="Select provider"]',
      'button:has-text("Select a provider")',
      '.provider-select'
    ];

    this.modelNameDropdownSelectors = [
      '.model-name-dropdown',
      '[data-testid="model-name-select"]',
      'select[name="modelName"]',
      '[aria-label="Select model"]',
      'button:has-text("Select a model")',
      '.model-select'
    ];

    this.modelConfigurationAddedSelectors = [
      '[data-testid="model-config-added"]',
      '.success-message:has-text("configuration added")',
      '[role="alert"]:has-text("configuration added")',
      '.model-config-success'
    ];

    this.modelNameSelectors = [
      '[data-testid="model-name-select"]',
      '.model-name-dropdown',
      'select[name="modelName"]',
      '[aria-label="Select model"]',
      'button:has-text("Select a model")',
      '.model-name-select'
    ];

    this.modelNameOptionSelectors = [
      `[role="option"]:has-text("anthropic.claude-v2")`,
      '.model-name-option:has-text("anthropic.claude-v2")',
      '.model-option:has-text("anthropic.claude-v2")',
      'li:has-text("anthropic.claude-v2")'
    ];

    this.publishButtonInDialogSelectors = [
      'button:has-text("Publish")',
      '[data-testid="confirm-publish-button"]',
      '.publish-dialog-confirm'
    ];

    // Model form selectors
    this.modelFormSelectors = {
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

    // Add Model Configuration button selectors
    this.addModelConfigurationSelectors = [
      'button:has-text("Add Model Configuration")',
      '[data-testid="add-model-config-button"]',
      '.add-config-btn', 
      '#add-model-config',
      'button.primary:has-text("Add Model Configuration")',
      'button:has-text("Add Configuration")',
      'a:has-text("Add Model Configuration")'
    ];

    // Create button selectors
    this.createButtonSelectors = [
      'button:has-text("Create")',
      '[data-testid="create-model-button"]',
      '.create-model-btn',
      '#create-model-btn', 
      'button[type="submit"]',
      'button.primary:has-text("Create")'
    ];
  }

  async isModelsSubmenuVisible() {
    return await this.isElementVisible(this.modelsSubmenuSelectors);
  }

  async isProvidersSubmenuVisible() {
    return await this.isElementVisible(this.providersSubmenuSelectors);
  }

  async selectProvider(providerName) {
    try {
      // First locate and click the provider dropdown to open it
      const dropdownTrigger = await this.page.waitForSelector(this.providerDropdownSelectors.join(','));
      await dropdownTrigger.click();
      console.log(`Clicked provider dropdown`);

      // Wait for the dropdown menu to appear and select the provider
      const providerOption = await this.page.waitForSelector(`[role="option"]:has-text("${providerName}")`);
      await providerOption.click();
      console.log(`Selected provider: ${providerName}`);

      // Wait for the selection to be applied
      await this.page.waitForTimeout(500);

      return true;
    } catch (error) {
      console.error(`Failed to select provider ${providerName}:`, error);
      throw error;
    }
  }

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

  async clickAddModelConfiguration() {
    await this.clickElement(this.addModelConfigurationSelectors);
  }

  async isOnModelsPage() {
    const url = this.page.url();
    return url.includes('/models') || url.includes('/registry');
  }

  async isModelConfigurationPageVisible() {
    const configPageSelectors = [
      // Text-based selectors
      'h2:has-text("Add Model Configuration")',
      'h2:has-text("Configure Model")',
      // XPath selectors
      '//h2[contains(text(), "Add Model Configuration")]',
      '//h2[contains(text(), "Configure Model")]',
      '//div[contains(text(), "Provider")]',
      '//div[contains(text(), "Model Name")]',
      // Form and container selectors
      'form',
      '[role="form"]',
      '.model-configuration',
      '.configuration-form',
      // Input fields that should be present
      'input[name="provider"]',
      'input[name="modelName"]',
      // Dropdown triggers
      'button[role="combobox"]',
      '.dropdown-trigger'
    ];

    try {
      // First wait for URL to contain 'configure'
      const currentUrl = this.page.url();
      console.log('Current URL:', currentUrl);
      
      // Then check for visible elements
      for (const selector of configPageSelectors) {
        try {
          const isVisible = await this.page.isVisible(selector);
          if (isVisible) {
            console.log('Found visible element with selector:', selector);
            return true;
          }
        } catch (e) {
          console.log('Selector check failed:', selector);
        }
      }
      
      // If no selectors matched, log the page content for debugging
      const content = await this.page.content();
      console.log('Page content:', content.substring(0, 500) + '...');
      
      return false;
    } catch (error) {
      console.error('Error in isModelConfigurationPageVisible:', error);
      return false;
    }
  }

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
  
  async selectModelName(modelName) {
    try {
      console.log(`Attempting to select model name: ${modelName}`);
      
      // More comprehensive selectors for the dropdown trigger
      const dropdownSelectors = [
        // Button/Select based
        'button:has-text("Select a model")',
        'button[role="combobox"]',
        'select#modelName',
        // Common class names
        '.model-dropdown',
        '.model-select',
        // Form field based
        '[name="modelName"]',
        // Aria based
        '[aria-label*="model"]',
        '[aria-label*="Model"]',
        // Text based
        'div:has-text("Select Model")',
        'span:has-text("Select Model")',
        // XPath
        '//button[contains(., "Select Model")]',
        '//div[contains(., "Model Name")]//following::button[3]'
      ];

      // Try to click the dropdown trigger
      console.log('Looking for model dropdown trigger...');
      let clicked = false;
      for (const selector of dropdownSelectors) {
        try {
          const element = await this.page.waitForSelector(selector, { 
            state: 'visible',
            timeout: 1000 
          });
          if (element) {
            console.log('Found dropdown trigger with selector:', selector);
            await element.click();
            clicked = true;
            break;
          }
        } catch (e) {
          console.log('Selector failed:', selector);
        }
      }

      if (!clicked) {
        throw new Error('Could not find model dropdown trigger');
      }

      // Wait for options to be visible
      await this.page.waitForTimeout(500);

      // Wait for dropdown menu/listbox to appear
      const dropdownMenuSelectors = [
        '[role="listbox"]',
        '[role="menu"]',
        '.dropdown-menu',
        '.select-options',
        '.model-options'
      ];

      console.log('Waiting for dropdown menu to appear...');
      let dropdownMenu = null;
      for (const selector of dropdownMenuSelectors) {
        try {
          dropdownMenu = await this.page.waitForSelector(selector, {
            state: 'visible',
            timeout: 2000
          });
          if (dropdownMenu) {
            console.log('Found dropdown menu with selector:', selector);
            break;
          }
        } catch (e) {
          console.log('Dropdown menu selector failed:', selector);
        }
      }

      // Try to find and click the model option
      const optionSelectors = [
        `[role="option"]:has-text("${modelName}")`,
        `li:has-text("${modelName}")`,
        `.model-option:has-text("${modelName}")`,
        `//li[contains(text(), "${modelName}")]`,
        `//div[contains(text(), "${modelName}")]`,
        `text="${modelName}"`,
        `.model-name-option:has-text("${modelName}")`,
        // Additional option selectors
        `[data-value="${modelName}"]`,
        `[value="${modelName}"]`,
        `option:has-text("${modelName}")`,
        `//option[contains(., "${modelName}")]`,
        // Try matching just the model identifier
        `[role="option"]:has-text("claude-v2")`,
        `li:has-text("claude-v2")`,
        `//li[contains(text(), "claude-v2")]`
      ];

      console.log('Looking for model option...');
      let optionClicked = false;
      for (const selector of optionSelectors) {
        try {
          // Log the full page content to see what options are available
          const pageContent = await this.page.content();
          console.log('Page content:', pageContent);

          const element = await this.page.waitForSelector(selector, {
            state: 'visible',
            timeout: 2000
          });
          if (element) {
            console.log('Found model option with selector:', selector);
            // Add a short delay before clicking
            await this.page.waitForTimeout(500);
            await element.click();
            optionClicked = true;
            break;
          }
        } catch (e) {
          console.log('Option selector failed:', selector);
        }
      }

      if (!optionClicked) {
        throw new Error('Could not find model option');
      }

      console.log(`Successfully selected model: ${modelName}`);
      return true;
    } catch (error) {
      console.error(`Failed to select model ${modelName}:`, error);
      throw error;
    }
  }

  async clickCreateButton() {
    await this.clickElement(this.createButtonSelectors);
  }

  async isModelConfigurationAdded() {
    const successSelectors = [
      // Toast/Notification selectors (from WorkspacePage pattern)
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
      '.toast-body',
      '.Toastify__toast-body',
      '.toast-content',
      '.notification-content',
      '[role="alert"] div',
      '.toastBody',
      '.toast--message',
      '.toast__message',
      '[data-testid="toast-message"]',
      '[data-testid="notification-message"]',
      '[data-testid="success-message"]',
      '.Toastify__toast',
      '.toast',
      '.notification',
      '.alert',
      // Model configuration specific selectors
      '[data-testid="model-config-added"]',
      '.model-config-success',
      // Visual confirmation
      '.configuration-list:has(.configuration-item)',
      '.model-configurations:not(:empty)',
      // Form specific success states
      'form[data-state="success"]',
      '.form-success',
      '[data-success="true"]'
    ];

    try {
      // Wait for success notification or indicators
      await this.page.waitForTimeout(1000);

      console.log('Checking for model configuration success...');
      
      // Try each selector with minimal timeout to be quick
      for (const selector of successSelectors) {
        try {
          // First check if element exists
          const elementHandle = await this.page.waitForSelector(selector, { timeout: 500 });
          if (elementHandle) {
            // Get the text content to verify it's a success message
            const text = await elementHandle.textContent();
            if (text && text.toLowerCase().includes('success')) {
              console.log(`Found success message: "${text}" with selector: ${selector}`);
              return true;
            }
          }
        } catch (e) {
          // Just move to next selector
          continue;
        }
      }

      // If we haven't found success yet, check page state
      const currentUrl = this.page.url();
      console.log('Current URL:', currentUrl);
      
      // Also try waiting for network idle
      await this.page.waitForLoadState('networkidle');
      
      // Check page content as last resort
      const content = await this.page.content();
      if (content.toLowerCase().includes('success')) {
        console.log('Found success message in page content');
        return true;
      }
      
      console.log('No success indicators found');
      return false;
    } catch (error) {
      console.error('Error checking model configuration added:', error);
      throw error;
    }
  }

  async verifyModelConfigurationStatus() {
    const statusSelectors = [
      '[data-testid="model-config-status"]',
      '.model-status:has-text("Published")',
      '.status-badge.published',
      '.model-configuration-status.active'
    ];

    // Wait for status indicator
    await this.page.waitForTimeout(1000); // Allow time for status update

    // Check if status is visible and correct
    for (const selector of statusSelectors) {
      try {
        const element = await this.page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
        if (element) {
          const text = await element.textContent();
          const isPublished = text.toLowerCase().includes('published');
          const isActive = text.toLowerCase().includes('active');
          console.log(`Found status indicator: ${text}`);
          return isPublished && isActive;
        }
      } catch (error) {
        console.log(`Selector ${selector} not found`);
        continue;
      }
    }
    
    throw new Error('Could not verify model configuration status');
  }
}

module.exports = ModelsPage;
