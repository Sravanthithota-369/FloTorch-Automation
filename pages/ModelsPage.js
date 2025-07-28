const BasePage = require('./BasePage');

class ModelsPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Page verification selectors
    this.modelsPageSelectors = [
      '//h1[text()="Model Registry"]'
    ];
    
    // Action buttons selectors (try CSS, text, and XPath fallbacks)
    //this.actionsMenuButtonSelectors = [
     
   // ];
    
    // Navigation menu selectors
    this.modelsMenuSelectors = [
      '//span[text()="Model Registry"]//ancestor::button'
    ];

    this.modelsSubmenuSelectors = [
      '//span[text()="Models"]//ancestor::a'
    ];

    this.providersSubmenuSelectors = [
      '//span[text()="Providers"]//ancestor::a'
    ];
  }

  async isModelsSubmenuVisible() {
    return await this.isElementVisible(this.modelsSubmenuSelectors);
  }

  async isProvidersSubmenuVisible() {
    return await this.isElementVisible(this.providersSubmenuSelectors);
  }



  // Note: publishName will be passed to clickPublishLatestOption method
  publishLatestOptionSelectors = [
    '//span[text()="PLACEHOLDER"]//ancestor::button'  // This is just a placeholder, actual selector is constructed in the method
  ];

  versionDropdownSelectors = [
    '//span[text()="Select a published version"]//ancestor::button'
  ];

  versionOptionSelectors = [
    '//div[@role="option"]'
  ]

  publishButtonInDialogSelectors = [
    '//span[text()="Publish"]//ancestor::button'
  ];

  actionsMenuButtonSelectors = [
    '//span[text()="Actions"]//ancestor::button',
     'button:has-text("Actions")',
      'text=Actions',
      '//button[normalize-space(text())="Actions"]',
      // table row Actions cell (first row, fifth column)
      '//th[normalize-space()="Actions"]//following::tbody//tr[1]//td[5]//button'
  ];

  actionsButton = [
    '//th[normalize-space()="Actions"]//following::tbody//tr[1]//td[5]//button'
  ];


  async clickActionsButton() {
    console.log('Attempting to click Actions button...');
    await this.page.pause();
    await this.clickElement(this.actionsButton);
    console.log('Clicked Actions button');
  }

  async clickActionsMenuButton() {
    // Try each selector: wait, scroll into view, and click
    for (const selector of this.actionsMenuButtonSelectors) {
      try {
        console.log(`Trying Actions selector: ${selector}`);
        const handle = await this.page.waitForSelector(selector, { timeout: 5000 });
        await handle.scrollIntoViewIfNeeded();
        await this.page.click(selector);
        console.log(`Clicked Actions button using selector: ${selector}`);
        return;
      } catch (err) {
        console.log(`Selector failed: ${selector} -> ${err.message}`);
        continue;
      }
    }
    throw new Error(
      `Could not click Actions button. Tried selectors: ${this.actionsMenuButtonSelectors.join(', ')}`
    );
  }

  async clickPublishLatestOption(publishName) {
    console.log(`Attempting to click ${publishName} option...`);
    // Try multiple selector strategies for the publish option
    const selectors = [
      `//span[text()="${publishName}"]//ancestor::button`,
      `button:has-text("${publishName}")`,
      `text=${publishName}`,
      // fallback: any button containing the text
      `xpath=//button[contains(normalize-space(.), "${publishName}")]`,
      // menu list items
      `xpath=//li//button[normalize-space(.)="${publishName}"]`
    ];
    for (const sel of selectors) {
      try {
        console.log(`Trying publish option selector: ${sel}`);
        const handle = await this.page.waitForSelector(sel, { timeout: 5000 });
        await handle.scrollIntoViewIfNeeded();
        await this.page.click(sel);
        console.log(`Clicked ${publishName} option using selector: ${sel}`);
        return;
      } catch (err) {
        console.log(`Selector failed: ${sel} -> ${err.message}`);
        continue;
      }
    }
    throw new Error(
      `Could not click '${publishName}' option. Tried: ${selectors.join(', ')}`
    );
  }

  async selectVersionFromDropdown(version) {
    await this.clickElement(this.versionDropdownSelectors);
    // wait for at least one option to appear
    const firstOption = this.versionOptionSelectors[0];
    await this.page.waitForSelector(firstOption, { state: 'visible', timeout: 5000 });
    // Try exact match, then contains match
    const selectors = [
      `//div[@role="option"]//span[text()="${version}"]`,
      `//div[@role="option"]//span[contains(normalize-space(.), "${version}")]`
    ];
    for (const sel of selectors) {
      try {
        console.log(`Trying version option selector: ${sel}`);
        await this.page.waitForSelector(sel, { timeout: 3000 });
        await this.clickElement([sel]);
        console.log(`Clicked version option using selector: ${sel}`);
        return;
      } catch (err) {
        console.log(`Selector failed: ${sel} -> ${err.message}`);
      }
    }
    // fallback to first available option
    console.log('Falling back to first version option');
    await this.clickElement(this.versionOptionSelectors);
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
    re//h2[text()='Add Model Configuration']turn url.includes('/models') || url.includes('/registry');
  }

  // Model form field selectors
  modelFormSelectors = {
    name: [
      'input[name="name"]',
   
    ],
    description: [
      'input[name="description"]',
    ]
  };

  /**
   * Fill in the model creation form
   * @param {Object} modelData - Object containing model data (name, description)
   */
  async fillModelDetails(modelData) {
    const { name, description } = modelData;
    console.log('Starting to fill model details form...');

      if (name) {
        console.log('Filling model name:', name);
        // Wait for name field to be ready
        await this.page.waitForSelector(this.modelFormSelectors.name.join(', '), { state: 'visible', timeout: 5000 });
        await this.fillInput(this.modelFormSelectors.name, name);
        console.log('Successfully filled model name');
    
      }

      if (description) {
        await this.page.waitForSelector(this.modelFormSelectors.description.join(', '), { state: 'visible', timeout: 5000 });
        await this.fillInput(this.modelFormSelectors.description, description);
        console.log('Successfully filled model description');
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

  clickAddConfigSelectors = [
    'button:has-text("Add Model Configuration")',
  ]


  async clickAddModelConfiguration() {
    console.log('Clicking Add Model Configuration button...');
    await this.clickElement(this.clickAddConfigSelectors);
    console.log('Clicked Add Model Configuration button');
  }
  /**
   * Click the Create button
   */
  async clickCreateButton() {
    await this.clickElement(this.createButtonSelectors);
  }

  /**
   * Verify if model configuration is published and active
   * @returns {Promise<boolean>}
   */
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

  /**
   * Select a provider from the Provider dropdown in model configuration
   * @param {string} providerName - Name of the provider to select
   */
  async selectProvider(providerName) {
    console.log(`Selecting provider: ${providerName}`);
    // Open the Provider dropdown using a single selector
    const dropdownSelector = '//label[text()="Provider"]//following::div[1]//button';
    await this.clickElement([dropdownSelector]);
    // Wait for provider options and select the matching one
    const optionSelector = `div[role="option"] >> span:has-text("${providerName}")`;
    await this.clickElement([optionSelector]);
    console.log(`Selected provider: ${providerName}`);
  }

  /**
   * Select a model name from the Model Name dropdown in model configuration
   * @param {string} modelName - Name of the model to select
   */
  async selectModelName(modelName) {
    console.log(`Selecting model name: ${modelName}`);
    // Open the Model Name dropdown using a single selector
    const dropdownSelector = '//label[text()="Model Name"]//following::div[1]//button';
    await this.clickElement([dropdownSelector]);
    // Wait for options and select the matching one
    const optionSelector = `div[role="option"] >> span:has-text("${modelName}")`;
    await this.clickElement([optionSelector]);
    console.log(`Selected model name: ${modelName}`);
  }
}

module.exports = ModelsPage;
