const BasePage = require('./BasePage');

/**
 * Providers Page Object - Handles provider management functionality
 */
class ProvidersPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Providers navigation selectors
    this.providersMenuSelectors = [
      'a:has-text("Providers")',
      '[data-testid="providers-menu"]',
      'nav a[href*="/providers"]',
      'text=Providers'
    ];
    
    // Add LLM Provider button selectors
    this.addLLMProviderButtonSelectors = [
      '//span[text()="Add LLM Provider"]//ancestor::button'
    ];
    
    // Provider creation dialog selectors
    this.addProviderDialogSelectors = [
      '[role="dialog"]',
      '.modal',
      '.provider-modal',
      '[data-testid="add-provider-modal"]'
    ];
    
    // Provider name input selectors
    this.providerNameInputSelectors = [
      'input[name="name"]'
    ];
    
    // Provider description input selectors
    this.providerDescriptionInputSelectors = [
      'input[name="description"]',
    ];
    
    // Provider dropdown selectors
    this.providerDropdownSelectors = [
      'select[name="provider"]',
      '[data-testid="provider-select"]',
      '.provider-select',
      'input[placeholder*="Search for a provider"]',
      'input[placeholder*="provider"]',
      'select'
    ];
    
    // Region input selectors - updated to match actual field names
    this.regionInputSelectors = [
      'input[name="options.region"]'
    ];
    
    // Access Key ID input selectors - updated to match actual field names
    this.accessKeyInputSelectors = [
      'input[name="options.accessKeyId"]',
    ];
    
    // Secret Access Key input selectors - updated to match actual field names
    this.secretKeyInputSelectors = [
      'input[name="options.secrets.secretAccessKey"]'
    ];
    
    // Create button in dialog selectors
    this.createButtonSelectors = [
      'button[type="submit"]',
    ];
    
    // Toast notification selectors (green success toasts)
    this.toastSelectors = [
      '.toast',
      '.notification',
      '.alert',
      '[role="alert"]',
      '.snackbar',
      '[data-testid="toast"]',
      '.toast-container',
      '.notification-container',
      '.alert-success',
      '.toast-success'
    ];
    
    // Provider list selectors
    this.providerListSelectors = [
      '.provider-item',
      '[data-testid="provider-item"]',
      'tr[data-provider]',
      '.provider-row',
      'table tbody tr'
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
   * Navigate to Providers page
   */
  async navigateToProviders() {
    await this.clickElement(this.providersMenuSelectors);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
    console.log('Navigated to Providers page');
  }

  /**
   * Click Add LLM Provider button
   */
  async clickAddLLMProvider() {
    await this.clickElement(this.addLLMProviderButtonSelectors);
    await this.page.waitForTimeout(300); // Wait for dialog to appear (reduced from 1000ms)
    console.log('Clicked Add LLM Provider button');
  }

  /**
   * Fill provider details
   * @param {Object} providerData - Provider details
   */
  async fillProviderDetails(providerData) {
    const { name, description, provider, region, accessKey, secretKey } = providerData;
       
    if (name) {
      await this.fillInput(this.providerNameInputSelectors[0], name);
      console.log(`Filled provider name: ${name}`);
    }
    
    // Fill description if provided
    if (description) {
      await this.fillInput(this.providerDescriptionInputSelectors[0], description);
      console.log(`Filled provider description: ${description}`);
    }
    
    // Select provider from dropdown if provided
    if (provider) {
      console.log(`Attempting to select provider: "${provider}"`);
      
      try {
        // First click the specific provider dropdown button using XPath
        await this.page.locator("//div[@class='mt-1 relative']//button").click();
        console.log('Clicked provider dropdown button using XPath: //div[@class=\'mt-1 relative\']//button');
        await this.page.waitForTimeout(1000); // Wait for dropdown to open
        
        // After clicking the dropdown, look for the provider options with text
        const elements = await this.page.locator(`//div[@role='option']`).all();
        console.log(`Found ${elements.length} provider options`);
        
        let selected = false;
        for (const element of elements) {
          try {
            const text = await element.textContent();
            console.log(`Checking option with text: ${text}`);
            
            if (text && text.includes(provider)) {
              console.log(`Found matching provider option: ${text}`);
              await element.click();
              console.log(`Selected provider "${provider}"`);
              selected = true;
              break;
            }
          } catch (e) {
            console.log(`Error checking/clicking provider option: ${e.message}`);
            continue;
          }
        }
        
        if (!selected) {
          throw new Error(`Could not find provider option: ${provider}`);
        }
        
        console.log(`Successfully selected provider: ${provider}`);
      } catch (error) {
        console.log(`Failed to select provider using direct approach, trying fallback methods: ${error.message}`);
      }
    }
    // Fill region
    if (region) {
      try {
        await this.page.waitForSelector(this.regionInputSelectors[0], { timeout: 3000 });
        await this.fillInput(this.regionInputSelectors[0], region);
        console.log(`Filled region: ${region}`);
      } catch (error) {
        console.log(`Failed to fill region: ${error.message}`);
      }
    }
    
    // Fill access key
    if (accessKey) {
      try {
        await this.fillInput(this.accessKeyInputSelectors[0], accessKey);
        console.log(`Filled access key: ${accessKey.substring(0, 8)}...`);
      } catch (error) {
        console.log(`Failed to fill access key: ${error.message}`);
      }
    }
    
    // Fill secret key
    if (secretKey) {
      try {
        await this.fillInput(this.secretKeyInputSelectors[0], secretKey);
        console.log(`Filled secret key: ${secretKey.substring(0, 8)}...`);
      } catch (error) {
        console.log(`Failed to fill secret key: ${error.message}`);
      }
      }
    }
  
  /**
   * Select option from dropdown
   * @param {Array} selectors - Dropdown selectors
   * @param {string} value - Value to select
   */
  async selectFromDropdown(selectors, value) {
    // First try traditional select elements
    for (const selector of selectors) {
      try {
        if (selector.includes('select')) {
          await this.page.waitForSelector(selector, { timeout: 3000 });
          await this.page.selectOption(selector, { label: value });
          console.log(`Selected "${value}" from select dropdown using selector: ${selector}`);
          return;
        }
      } catch (error) {
        console.log(`Could not select from dropdown with selector: ${selector}`);
        continue;
      }
    }
    
    // Try searchable dropdown approach
    for (const selector of selectors) {
      try {
        if (selector.includes('input')) {
          // Click on the search input
          await this.page.waitForSelector(selector, { timeout: 3000 });
          await this.page.click(selector);
          await this.page.waitForTimeout(300); // Reduced from 500ms
          
          // Clear and type the provider name
          await this.page.fill(selector, '');
          await this.page.type(selector, value);
          await this.page.waitForTimeout(800); // Reduced from 1000ms
          
          // Try to click on the matching option that appears
          const optionSelectors = [
            `[role="option"]:has-text("${value}")`,
            `li:has-text("${value}")`,
            `div:has-text("${value}")`,
            `.option:has-text("${value}")`,
            `[data-value*="${value}"]`,
            `text=${value}`
          ];
          
          for (const optionSelector of optionSelectors) {
            try {
              await this.page.waitForSelector(optionSelector, { timeout: 2000 });
              await this.page.click(optionSelector);
              console.log(`Selected "${value}" from searchable dropdown using option selector: ${optionSelector}`);
              return;
            } catch (err) {
              console.log(`Could not click option with selector: ${optionSelector}`);
              continue;
            }
          }
          
          // If no option found, try pressing Enter
          try {
            await this.page.press(selector, 'Enter');
            console.log(`Selected "${value}" by pressing Enter in search field`);
            return;
          } catch (err) {
            console.log(`Could not select by pressing Enter`);
          }
        }
      } catch (error) {
        console.log(`Could not use searchable dropdown with selector: ${selector}`);
        continue;
      }
    }
    
    // Original dropdown approach
    for (const selector of selectors) {
      try {
        await this.page.waitForSelector(selector, { timeout: 3000 });
        await this.page.selectOption(selector, { label: value });
        return;
      } catch (error) {
        console.log(`Could not select from dropdown with selector: ${selector}`);
        continue;
      }
    }
    
    // If select option doesn't work, try clicking the dropdown and selecting
    for (const selector of selectors) {
      try {
        await this.page.click(selector);
        await this.page.waitForTimeout(300); // Reduced from 500ms
        
        // Try to click on the option
        const optionSelectors = [
          `option:has-text("${value}")`,
          `[role="option"]:has-text("${value}")`,
          `li:has-text("${value}")`,
          `div:has-text("${value}")`
        ];
        
        for (const optionSelector of optionSelectors) {
          try {
            await this.page.click(optionSelector);
            return;
          } catch (error) {
            continue;
          }
        }
      } catch (error) {
        continue;
      }
    }
    
    throw new Error(`Could not select "${value}" from dropdown`);
  }

  /**
   * Submit provider creation
   */
  async submitProviderCreation() {
    await this.page.waitForSelector(this.createButtonSelectors[0], { timeout: 1000 });
    await this.clickElement(this.createButtonSelectors[0]);
    console.log('Submitted provider creation');
  }

  /**
   * Create a new provider
   * @param {Object} providerData - Provider details
   */
  async createNewProvider(providerData) {
    await this.clickAddLLMProvider();
    await this.fillProviderDetails(providerData);
    await this.submitProviderCreation();
    
    // Wait for creation to complete (reduced from 2000ms)
    await this.page.waitForTimeout(1000);
    console.log(`Provider creation initiated: ${providerData.name}`);
  }

  /**
   * Wait for and capture toast notifications
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
   * Capture toast notifications
   * @returns {Array} Array of toast messages with color info
   */
  async captureToastNotifications() {
    const toasts = [];
    
    for (const selector of this.toastSelectors) {
      try {
        await this.page.waitForSelector(selector, { timeout: 3000 });
        const toastElements = await this.page.$$(selector);
        
        for (const toast of toastElements) {
          const text = await toast.textContent();
          const className = await toast.getAttribute('class');
          const backgroundColor = await toast.evaluate(el => getComputedStyle(el).backgroundColor);
          
          if (text && text.trim()) {
            const toastInfo = {
              text: text.trim(),
              className: className || '',
              backgroundColor: backgroundColor || '',
              isSuccess: this.isSuccessToast(className, backgroundColor)
            };
            
            toasts.push(toastInfo);
            console.log(`Toast notification captured: ${text.trim()}, Success: ${toastInfo.isSuccess}`);
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
   * Check if toast is a success toast (green color)
   * @param {string} className - CSS class name
   * @param {string} backgroundColor - Background color
   * @returns {boolean} True if it's a success toast
   */
  isSuccessToast(className, backgroundColor) {
    const successIndicators = [
      'success',
      'green',
      'positive',
      'valid'
    ];
    
    const classLower = (className || '').toLowerCase();
    const bgLower = (backgroundColor || '').toLowerCase();
    
    // Check class names
    const hasSuccessClass = successIndicators.some(indicator => classLower.includes(indicator));
    
    // Check background color (green variations)
    const hasGreenBg = bgLower.includes('green') || 
                       bgLower.includes('rgb(34, 197, 94)') || // green-500
                       bgLower.includes('rgb(22, 163, 74)') || // green-600
                       bgLower.includes('rgb(21, 128, 61)') ||  // green-700
                       bgLower.includes('#22c55e') ||
                       bgLower.includes('#16a34a') ||
                       bgLower.includes('#15803d');
    
    return hasSuccessClass || hasGreenBg;
  }

  /**
   * Verify toast message content
   * @param {string} expectedMessage - Expected message content
   * @param {Array} toasts - Array of captured toasts
   * @returns {boolean} True if message matches
   */
  verifyToastMessage(expectedMessage, toasts) {
    return toasts.some(toast => 
      toast.text.toLowerCase().includes(expectedMessage.toLowerCase())
    );
  }

  /**
   * Verify toast is green/success color
   * @param {Array} toasts - Array of captured toasts
   * @returns {boolean} True if any toast is green/success
   */
  verifyToastIsGreen(toasts) {
    return toasts.some(toast => toast.isSuccess);
  }

  /**
   * Verify provider exists in the list
   * @param {string} providerName - Name of the provider to verify
   * @returns {boolean} True if provider exists
   */
  async verifyProviderExists(providerName) {
    try {
      const providerSelectors = [
        `text=${providerName}`,
        `[data-provider="${providerName}"]`,
        `.provider-item:has-text("${providerName}")`,
        `tr:has-text("${providerName}")`,
        `td:has-text("${providerName}")`
      ];
      
      for (const selector of providerSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 3000 });
          console.log(`Provider "${providerName}" found in list`);
          return true;
        } catch (error) {
          continue;
        }
      }
      
      console.log(`Provider "${providerName}" not found in list`);
      return false;
    } catch (error) {
      console.log(`Error verifying provider existence: ${error.message}`);
      return false;
    }
  }

  /**
   * Take screenshot with providers context
   * @param {string} stepName - Name of the step for screenshot
   * @returns {string} Screenshot file path
   */
  async captureProvidersScreenshot(stepName) {
    return await this.captureScreenshotForAllure(`Providers_${stepName}`);
  }

  /**
   * Get current page URL
   * @returns {string} Current URL
   */
  getCurrentUrl() {
    return this.page.url();
  }

  /**
   * Verify we are on providers page
   * @returns {boolean} True if on providers page
   */
  async verifyOnProvidersPage() {
    const currentUrl = this.getCurrentUrl();
    const isOnProvidersPage = currentUrl.includes('/providers') || currentUrl.includes('/registry/providers');
    console.log(`Current URL: ${currentUrl}, On providers page: ${isOnProvidersPage}`);
    return isOnProvidersPage;
  }
}

module.exports = ProvidersPage;
