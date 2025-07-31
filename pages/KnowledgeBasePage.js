const BasePage = require('./BasePage');

/**
 * KnowledgeBase Page Object - Handles knowledge base navigation and CRUD operations
 */
class KnowledgeBasePage extends BasePage {
  constructor(page) {
    super(page);
    // Sidebar menu
    this.knowledgeBasesMenuSelector = ['text=Knowledge Bases', 'a:has-text("Knowledge Bases")'];
    // Submenus
    this.repositorySubmenuSelector = ['text=Repository', 'a:has-text("Repository")'];
    this.providersSubmenuSelector = ['text=Providers', 'a:has-text("Providers")'];
    // Page headers
    this.providersHeaderSelector = 'h1:has-text("Knowledge Base Providers")';
    this.repositoryHeaderSelector = 'h1:has-text("Knowledge Base Repository")';
    // Add buttons
    this.addProviderButtonSelector = 'button:has-text("Add Vector Storage Provider")';
    this.addKBButtonSelector = 'button:has-text("Add KB")';
    // Modals
    this.providerModalHeader = 'h2:has-text("Add Vector Storage Provider")';
    this.kbModalHeader = 'h2:has-text("Add new KB")';

    this.vectorStorageMenu = '//h2[text()="Add Vector Storage Provider"]';
    // Provider form fields (input selectors)
    this.providerFieldSelectors = {
      name: ['input[name="name"]', 'input#name', 'input[placeholder*="name"]'],
      description: ['input[name="description"]', 'textarea[name="description"]', 'input#description'],
      // Dropdown input to select provider - expanded with multiple selector strategies
      provider: [
        'input[placeholder*="Select a provider"]', 
        'input[placeholder*="provider"]',
        '[role="combobox"]',
        '.provider-dropdown',
        'div.dropdown',
        'input[aria-haspopup="listbox"]',
        'input.dropdown-input'
      ],
      region: ['input[name="options.region"]', 'input[placeholder*="region"]'],
      accessKey: ['input[name="options.accessKeyId"]', 'input[placeholder*="Access Key"]'],
      secretKey: ['input[name="options.secrets.secretAccessKey"]', 'input[placeholder*="Secret Key"]']
    };
    this.createProviderButton = [
      'button:has-text("Create")', 
      'button[type="submit"]', 
      'form button[type="submit"]', 
      '.modal-footer button:last-child'
    ];
    // KB form fields
    this.kbFieldSelectors = {
      name: 'input[name="name"]',
      description: 'input[name="description"]',
      provider: [
        'input[placeholder*="Select a provider"]',
        '[role="combobox"]',
        'button[aria-haspopup="listbox"]',
        'button[aria-controls*="combobox"]',
        'div.relative button',
        'div.relative > button'
      ],
      databaseName: ['input[name="dbName"]', 'input[name="databaseName"]', 'input[placeholder*="Database"]']
    };
    this.createKBButton = 'button:has-text("Create")';
    // Toast notifications
    this.successToastSelector = ['.toast-success', '[role="alert"]', '.notification-success'];
  }

  // Navigate via sidebar
  async clickKnowledgeBasesMenu() {
    await this.clickElement(this.knowledgeBasesMenuSelector);
    await this.page.waitForLoadState('networkidle');
  }
  async clickRepositorySubmenu() {
    await this.clickElement(this.repositorySubmenuSelector);
    await this.page.waitForLoadState('networkidle');
  }
  async clickProvidersSubmenu() {
    await this.clickElement(this.providersSubmenuSelector);
    await this.page.waitForLoadState('networkidle');
  }
  // Verify pages loaded
  async verifyOnProvidersPage() {
    return await this.isElementVisible(this.providersHeaderSelector);
  }
  async verifyOnRepositoryPage() {
    return await this.isElementVisible(this.repositoryHeaderSelector);
  }
  // Provider actions
  async clickAddProvider() {
    await this.clickElement(this.addProviderButtonSelector);
    await this.page.waitForSelector(this.providerModalHeader);
  }
  /**
   * Fill provider creation form fields
   * @param {Object} data - key/value pairs of provider fields
   */
  /**
   * Fill provider details form
   * @param {Object} data - Provider data including name, description, provider, region, etc.
   */
  async fillProviderDetails(data) {
    try {
      console.log('Starting to fill provider details form...');
      
      // Take screenshot at the beginning
      await this.takeDebugScreenshot('provider-form-before');

      // Name field
      if (data.name) {
        await this.fillInput(this.providerFieldSelectors.name, data.name);
        console.log(`Filled provider name: ${data.name}`);
      }
      
      // Description field
      if (data.description) {
        await this.fillInput(this.providerFieldSelectors.description, data.description);
        console.log(`Filled provider description: ${data.description}`);
      }
      
      // Provider dropdown
      if (data.provider) {
        console.log(`Attempting to select provider: ${data.provider}`);
        
        try {
          // First try to click the dropdown
          const dropdownSelectors = [
            "//div[contains(@class, 'relative')]//button",
            "[role='combobox']",
            "button[role='combobox']",
            "button[aria-haspopup='listbox']",
            "input[aria-haspopup='listbox']"
          ];
          
          let clicked = false;
          for (const selector of dropdownSelectors) {
            try {
              await this.page.waitForSelector(selector, { timeout: 5000 });
              await this.page.click(selector);
              console.log(`Clicked provider dropdown using selector: ${selector}`);
              clicked = true;
              await this.page.waitForTimeout(1000);
              break;
            } catch (err) {
              console.log(`Failed to click dropdown with selector ${selector}: ${err.message}`);
            }
          }
          
          if (!clicked) {
            throw new Error('Could not click any provider dropdown selector');
          }
          
          // Capture screenshot after clicking dropdown
          await this.takeDebugScreenshot('after-dropdown-click');
          
          // Look for the provider option - expanded selectors
          const optionSelectors = [
            `//div[contains(@role, 'option')][contains(text(), '${data.provider}')]`,
            `//li[contains(@role, 'option')][contains(text(), '${data.provider}')]`,
            `//div[@role='option'][contains(., '${data.provider}')]`,
            `text=${data.provider}`,
            `//div[contains(text(), '${data.provider}')]`,
            `//div[contains(@class, 'group')][contains(., '${data.provider}')]`,
            `//div[contains(@class, 'option')][contains(., '${data.provider}')]`
          ];
          
          let selected = false;
          for (const selector of optionSelectors) {
            try {
              // Increase visibility timeout
              await this.page.waitForSelector(selector, { timeout: 5000 });
              await this.page.click(selector);
              console.log(`Selected provider ${data.provider} using selector: ${selector}`);
              selected = true;
              break;
            } catch (err) {
              console.log(`Failed with option selector ${selector}: ${err.message}`);
            }
          }
          
          if (!selected) {
            // Try typing approach if clicking options didn't work
            try {
              const inputSelectors = [
                'input[placeholder*="provider"]',
                'input[role="combobox"]',
                'input[aria-haspopup="listbox"]'
              ];
              
              for (const inputSelector of inputSelectors) {
                try {
                  await this.page.waitForSelector(inputSelector, { timeout: 2000 });
                  await this.page.fill(inputSelector, data.provider);
                  await this.page.waitForTimeout(1000);
                  await this.page.keyboard.press('Enter');
                  console.log(`Used typing approach for provider selection with ${inputSelector}`);
                  selected = true;
                  break;
                } catch (typErr) {
                  console.log(`Failed typing with selector ${inputSelector}: ${typErr.message}`);
                }
              }
              
              if (!selected) {
                throw new Error(`Could not select provider ${data.provider} after multiple attempts`);
              }
            } catch (typingError) {
              console.log(`Typing approach failed: ${typingError.message}`);
              throw typingError;
            }
          }
        } catch (err) {
          console.log(`Provider selection failed: ${err.message}`);
          throw err;
        }
      }
      
      // Region field
      if (data.region) {
        try {
          // More robust region selectors
          const regionSelectors = [
            'input[name="options.region"]', 
            'input[placeholder*="region"]',
            'input[placeholder*="Region"]',
            'input[id*="region"]',
            'label:has-text("Region") + input',
            'label:has-text("Region") ~ input'
          ];
          
          let filled = false;
          for (const selector of regionSelectors) {
            try {
              await this.page.waitForSelector(selector, { timeout: 2000 });
              await this.page.fill(selector, data.region);
              console.log(`Filled region: ${data.region} using selector: ${selector}`);
              filled = true;
              break;
            } catch (err) {
              console.log(`Failed to fill region with selector ${selector}: ${err.message}`);
            }
          }
          
          if (!filled) {
            throw new Error(`Could not find any input field for region`);
          }
        } catch (regionErr) {
          console.log(`Error filling region field: ${regionErr.message}`);
          // Continue with other fields
        }
      }
      
      // Access key field
      if (data.accessKey) {
        try {
          // More robust access key selectors
          const accessKeySelectors = [
            'input[name="options.accessKeyId"]',
            'input[placeholder*="Access Key"]',
            'input[placeholder*="API Key"]',
            'input[id*="accessKey"]',
            'input[id*="apiKey"]',
            'label:has-text("Access Key") + input',
            'label:has-text("API Key") + input',
            'input[placeholder*="access"]',
            'input[name*="key"][name*="id"]'
          ];
          
          let filled = false;
          for (const selector of accessKeySelectors) {
            try {
              await this.page.waitForSelector(selector, { timeout: 2000 });
              await this.page.fill(selector, data.accessKey);
              console.log(`Filled access key using selector: ${selector}`);
              filled = true;
              break;
            } catch (err) {
              console.log(`Failed to fill access key with selector ${selector}: ${err.message}`);
            }
          }
          
          if (!filled) {
            throw new Error(`Could not find any input field for access key`);
          }
        } catch (accessKeyErr) {
          console.log(`Error filling access key field: ${accessKeyErr.message}`);
          // Continue with other fields
        }
      }
      
      // Secret key field
      if (data.secretKey) {
        try {
          // Take a screenshot to help debug the form state
          await this.takeDebugScreenshot('before-secret-key-input');
          
          // Find all input fields and identify the secret key field
          console.log('Searching for the secret key field using various strategies...');
          
          // Try getting all input fields and analyze them
          const inputFields = await this.page.$$('input');
          console.log(`Found ${inputFields.length} input fields on the page`);
          
          // More robust secret key selectors with higher timeouts
          const secretKeySelectors = [
            'input[name="options.secretAccessKey"]',
            'input[name="options.secrets.secretAccessKey"]'
          ];
          
          let filled = false;
          for (const selector of secretKeySelectors) {
            try {
              console.log(`Trying secret key selector: ${selector}`);
              await this.page.waitForSelector(selector, { timeout: 3000 });
              
              // Check if element is visible
              const isVisible = await this.page.isVisible(selector);
              if (!isVisible) {
                console.log(`Element found but not visible: ${selector}`);
                continue;
              }
              
              await this.page.fill(selector, data.secretKey);
              console.log(`Filled secret key using selector: ${selector}`);
              filled = true;
              break;
            } catch (err) {
              console.log(`Failed to fill secret key with selector ${selector}: ${err.message}`);
            }
          }
          
          if (!filled) {
            console.log('Using fallback approach for secret key - trying all password fields');
            // Fallback: try to fill all password inputs if found
            try {
              const passwordFields = await this.page.$$('input[type="password"]');
              if (passwordFields.length > 0) {
                await passwordFields[0].fill(data.secretKey);
                console.log('Filled first password field as secret key');
                filled = true;
              }
            } catch (pwErr) {
              console.log('Password field fallback failed:', pwErr.message);
            }
          }
          
          if (!filled) {
            throw new Error(`Could not find any input field for secret key`);
          }
          
          // Take a screenshot after attempting to fill the secret key
          await this.takeDebugScreenshot('after-secret-key-input');
        } catch (secretKeyErr) {
          console.log(`Error filling secret key field: ${secretKeyErr.message}`);
          // Continue with other fields
        }
      }
      
      // Take screenshot after filling all fields
      await this.takeDebugScreenshot('provider-form-after');
      
      return true;
    } catch (error) {
      console.error(`Error filling provider details: ${error.message}`);
      await this.takeDebugScreenshot('provider-form-error');
      throw error;
    }
  }

  async submitProviderCreation() {
    try {
      console.log('Attempting to submit provider creation');
      await this.takeDebugScreenshot('before-create-provider');
      
      // Try multiple selectors for the create button
      const createButtonSelectors = [
        this.createProviderButton,
        'button:has-text("Create")',
        'button[type="submit"]',
        'form button',
        'form button[type="submit"]'
      ];
      
      let clicked = false;
      for (const selector of createButtonSelectors) {
        try {
          console.log(`Trying to click Create button with selector: ${selector}`);
          await this.page.click(selector);
          clicked = true;
          console.log('Provider creation button clicked successfully');
          break;
        } catch (btnError) {
          console.log(`Failed to click button with selector ${selector}: ${btnError.message}`);
        }
      }
      
      if (!clicked) {
        throw new Error('Could not click any Create button selector');
      }
      
      // Wait for form submission and potential redirect
      await this.page.waitForLoadState('networkidle');
    } catch (err) {
      console.error(`Failed to submit provider creation: ${err.message}`);
      await this.takeDebugScreenshot('create-provider-failure');
      throw err;
    }
  }
  
  /**
   * Take a debug screenshot with timestamp for troubleshooting
   * @param {string} name - Name for the screenshot file
   */
  async takeDebugScreenshot(name) {
    try {
      const timestamp = Date.now();
      const path = `tests/screenshots/${name}-${timestamp}.png`;
      await this.page.screenshot({ path, fullPage: true });
      console.log(`Debug screenshot saved: ${path}`);
      return path;
    } catch (err) {
      console.log(`Failed to take debug screenshot: ${err.message}`);
    }
  }
  
  /**
   * Submit the provider creation form
   */
  async submitProviderCreation() {
    try {
      console.log('Attempting to submit provider creation');
      await this.takeDebugScreenshot('before-create-provider');
      
      // Take screenshot of the entire form for debugging
      await this.page.screenshot({ path: 'tests/screenshots/full-form-before-submit.png', fullPage: true });
      
      // Expanded create button selectors - we'll try multiple approaches
      const createButtonSelectors = [
        ...this.createProviderButton,
        'button:has-text("Create")',
        'form button[type="submit"]',
        'button[type="submit"]',
        '.modal-footer button:last-child',
        'button.primary',
        'button.submit',
        // Try finding by position
        '.modal-footer button',
        'form > div:last-child > button',
        // Try finding by text content
        'text="Create"',
        'button:text("Create")',
        'button:text-is("Create")'
      ];
      
      let clicked = false;
      for (const selector of createButtonSelectors) {
        try {
          console.log(`Trying to click Create button with selector: ${selector}`);
          // Increase timeout for finding the button
          await this.page.waitForSelector(selector, { timeout: 5000 });
          
          // Ensure the element is visible and enabled
          const isVisible = await this.page.isVisible(selector);
          if (!isVisible) {
            console.log(`Create button found but not visible: ${selector}`);
            continue;
          }
          
          // Check if button is enabled
          const isDisabled = await this.page.evaluate((sel) => {
            const el = document.querySelector(sel);
            return el ? el.disabled : true;
          }, selector);
          
          if (isDisabled) {
            console.log(`Create button found but disabled: ${selector}`);
            continue;
          }
          
          await this.page.click(selector);
          clicked = true;
          console.log(`Create button clicked successfully with selector: ${selector}`);
          break;
        } catch (btnError) {
          console.log(`Failed to click button with selector ${selector}: ${btnError.message}`);
        }
      }
      
      if (!clicked) {
        // Final attempt - try to find any button that might be the submit button
        try {
          const buttons = await this.page.$$('button');
          console.log(`Found ${buttons.length} buttons on the page`);
          
          for (const button of buttons) {
            const buttonText = await button.textContent();
            console.log(`Found button with text: ${buttonText}`);
            
            if (buttonText && buttonText.includes('Create')) {
              await button.click();
              clicked = true;
              console.log('Clicked button with text containing "Create"');
              break;
            }
          }
        } catch (finalError) {
          console.log('Failed in final button search attempt:', finalError.message);
        }
      }
      
      if (!clicked) {
        throw new Error('Could not click any Create button selector');
      }
      
      // Wait for form submission and potential redirect
      await this.page.waitForLoadState('networkidle');
      console.log('Provider creation submitted successfully');
      
      // Take screenshot after submission
      await this.takeDebugScreenshot('after-create-provider');
      
    } catch (err) {
      console.error(`Failed to submit provider creation: ${err.message}`);
      await this.takeDebugScreenshot('create-provider-failure');
      throw err;
    }
  }
  
  // KB actions
  async clickAddKB() {
    await this.clickElement(this.addKBButtonSelector);
    await this.page.waitForSelector(this.kbModalHeader);
  }
  async fillKBDetails(data) {
    console.log('Starting to fill KB details form...');
    await this.takeDebugScreenshot('kb-form-before');
    
    for (const [field, value] of Object.entries(data)) {
      const key = field === 'database name' ? 'databaseName' : field;
      const selector = this.kbFieldSelectors[key];
      
      if (!selector) {
        console.log(`No selector found for field: ${field}`);
        continue;
      }
      
      if (field === 'provider') {
        console.log(`Attempting to select provider: ${value}`);
        // Handle provider dropdown specially
        try {
          // Try to click the dropdown
          const selectors = Array.isArray(selector) ? selector : [selector];
          let clicked = false;
          
          for (const dropdownSelector of selectors) {
            try {
              await this.page.waitForSelector(dropdownSelector, { timeout: 3000 });
              await this.page.click(dropdownSelector);
              console.log(`Clicked provider dropdown using selector: ${dropdownSelector}`);
              clicked = true;
              await this.takeDebugScreenshot('after-kb-dropdown-click');
              break;
            } catch (err) {
              console.log(`Failed with dropdown selector ${dropdownSelector}: ${err.message}`);
            }
          }
          
          if (!clicked) {
            throw new Error('Could not click provider dropdown');
          }
          
          // Wait for the dropdown to appear
          await this.page.waitForTimeout(500);
          
          // Try to select the option
          const optionSelectors = [
            `//div[@role='option'][contains(., '${value}')]`,
            `//li[@role='option'][contains(., '${value}')]`,
            `//div[contains(@class, 'option')][contains(., '${value}')]`,
            `text="${value}"`,
            `div:has-text("${value}")`,
            `li:has-text("${value}")`
          ];
          
          let selected = false;
          for (const optionSelector of optionSelectors) {
            try {
              await this.page.waitForSelector(optionSelector, { timeout: 5000 });
              await this.page.click(optionSelector);
              console.log(`Selected provider ${value} using selector: ${optionSelector}`);
              selected = true;
              break;
            } catch (err) {
              console.log(`Failed with option selector ${optionSelector}: ${err.message}`);
            }
          }
          
          if (!selected) {
            throw new Error(`Could not select provider option: ${value}`);
          }
        } catch (err) {
          console.error(`Error selecting provider: ${err.message}`);
          await this.takeDebugScreenshot('provider-selection-error');
          throw err;
        }
      } else {
        // For other fields, use the regular fillInput method
        try {
          const selectors = Array.isArray(selector) ? selector : [selector];
          let filled = false;
          
          for (const inputSelector of selectors) {
            try {
              await this.fillInput(inputSelector, value);
              console.log(`Filled ${field}: ${value} using selector: ${inputSelector}`);
              filled = true;
              break;
            } catch (err) {
              console.log(`Failed to fill ${field} with selector ${inputSelector}: ${err.message}`);
            }
          }
          
          if (!filled) {
            throw new Error(`Could not fill field: ${field}`);
          }
        } catch (err) {
          console.error(`Error filling ${field}: ${err.message}`);
          await this.takeDebugScreenshot(`${field}-input-error`);
          throw err;
        }
      }
    }
    
    await this.takeDebugScreenshot('kb-form-after');
    console.log('Successfully filled KB details');
  }
  async submitKBCreation() {
    await this.clickElement(this.createKBButton);
  }
  // Notifications
  async isSuccessToastVisible() {
    return await this.isElementVisible(this.successToastSelector);
  }

  async isVectorStorageMenuVisible() {
    return await this.isElementVisible(this.vectorStorageMenu);
  }

  async isAddKBModalVisible() {
    return await this.isElementVisible(this.kbModalHeader);
  }
}

module.exports = KnowledgeBasePage;
