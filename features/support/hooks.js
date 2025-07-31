const { Before, After, BeforeAll, AfterAll, BeforeStep, AfterStep, setDefaultTimeout, setWorldConstructor } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const CustomWorld = require('./world');
const AllureHelper = require('../../utils/allure-helper');
const fs = require('fs');
const path = require('path');

// Set custom world constructor
setWorldConstructor(CustomWorld);

// Set default timeout for steps
setDefaultTimeout(60000);

// Global variables
let browser;
let context;
let page;

// Before all tests
BeforeAll(async function () {
  console.log('=== Starting Test Suite with Allure Reporting ===');
  
  // Setup Allure directories and configuration
  AllureHelper.setup();
  
  // Launch browser
  browser = await chromium.launch({
    headless: false, // Run in headed mode
    slowMo: 500, // Slow down for better visibility
    args: ['--start-maximized']
  });
  
  console.log('Browser launched successfully');
});

// Before each scenario
Before(async function (scenario) {
  console.log(`\n=== Starting Scenario: ${scenario.pickle.name} ===`);
  
  // Create new context and page for each scenario
  context = await browser.newContext({
    viewport: null, // Use default viewport
    recordVideo: {
      dir: 'allure-results/videos/',
      size: { width: 1280, height: 720 }
    }
  });
  
  page = await context.newPage();
  
  // Make page available globally
  this.page = page;
  this.context = context;
  
  // Initialize page objects
  this.initPageObjects(page);
  
  // Verify KnowledgeBasePage initialization
  if (this.knowledgeBasePage) {
    console.log('KnowledgeBasePage successfully initialized');
    console.log('Available methods:', Object.keys(this.knowledgeBasePage.__proto__).join(', '));
  } else {
    console.error('ERROR: KnowledgeBasePage not properly initialized!');
  }
  
  console.log('New browser context and page created');
});

// Automatic screenshot capture for every step
AfterStep(async function (step) {
  if (this.page && !this.page.isClosed()) {
    try {
      const stepText = step.pickleStep.text.replace(/[^a-zA-Z0-9]/g, '_');
      const timestamp = Date.now();
      const screenshotName = `${stepText}_${timestamp}`;
      const screenshotPath = `allure-results/screenshots/${screenshotName}.png`;
      
      // Ensure screenshots directory exists
      const screenshotsDir = path.dirname(screenshotPath);
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }
      
      // Take screenshot
      await this.page.screenshot({ 
        path: screenshotPath,
        fullPage: false,  // Faster screenshots
        quality: 80      // Reduce file size
      });
      
      // Attach to Allure with clean step name
      const screenshot = fs.readFileSync(screenshotPath);
      this.attach(screenshot, 'image/png', step.pickleStep.text);
      
      console.log(`Auto-screenshot captured: ${step.pickleStep.text}`);
      
    } catch (error) {
      console.log(`Failed to capture auto-screenshot for step: ${step.pickleStep.text}`, error.message);
    }
  }
});

// After each scenario
After(async function (scenario) {
  console.log(`\n=== Ending Scenario: ${scenario.pickle.name} ===`);
  
  try {
    const scenarioName = scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = Date.now();
    
    if (scenario.result.status === 'FAILED') {
      console.log('Scenario failed - capturing evidence');
      
      // Take screenshot on failure
      if (page && !page.isClosed()) {
        const screenshotPath = `allure-results/screenshots/failed-${scenarioName}-${timestamp}.png`;
        await page.screenshot({ 
          path: screenshotPath,
          fullPage: true 
        });
        
        // Attach screenshot to Allure report with custom name
        const screenshot = fs.readFileSync(screenshotPath);
        this.attach(screenshot, 'image/png', `Failed Screenshot: ${scenario.pickle.name}`);
        
        // Attach page HTML for debugging
        try {
          const html = await page.content();
          this.attach(html, 'text/html', 'Page HTML at Failure');
        } catch (htmlError) {
          console.log('Could not capture HTML:', htmlError.message);
        }
        
        // Attach current URL
        try {
          const currentUrl = page.url();
          this.attach(`Current URL at failure: ${currentUrl}`, 'text/plain', 'URL at Failure');
        } catch (urlError) {
          console.log('Could not capture URL:', urlError.message);
        }
        
        // Attach browser console logs if available
        try {
          const logs = await page.evaluate(() => {
            return window.console._logs || 'No console logs captured';
          });
          this.attach(JSON.stringify(logs, null, 2), 'application/json', 'Browser Console Logs');
        } catch (logError) {
          // Console logs not available
        }
      }
    } else if (scenario.result.status === 'PASSED') {
      console.log('Scenario passed - taking success screenshot');
      
      // Take screenshot on success as well
      if (page && !page.isClosed()) {
        try {
          const screenshotPath = `allure-results/screenshots/success-${scenarioName}-${timestamp}.png`;
          await page.screenshot({ 
            path: screenshotPath,
            fullPage: true 
          });
          
          // Attach success screenshot to Allure report
          const screenshot = fs.readFileSync(screenshotPath);
          this.attach(screenshot, 'image/png', `Success Screenshot: ${scenario.pickle.name}`);
          
          // Attach final URL for successful tests
          const currentUrl = page.url();
          this.attach(`Final URL: ${currentUrl}`, 'text/plain', 'Final URL');
          
        } catch (screenshotError) {
          console.log('Could not take success screenshot:', screenshotError.message);
        }
      }
    }
    
    // Close context and page
    if (context && !context._closed) {
      await context.close();
    }
    
  } catch (error) {
    console.log('Error in After hook:', error.message);
  }
  
  console.log('Browser context closed');
});

// After all tests
AfterAll(async function () {
  console.log('\n=== Test Suite Completed ===');
  
  // Close browser
  if (browser) {
    await browser.close();
  }
  
  console.log('Browser closed');
  console.log('Allure results saved to: allure-results/');
});

module.exports = {
  getBrowser: () => browser,
  getContext: () => context,
  getPage: () => page
};
