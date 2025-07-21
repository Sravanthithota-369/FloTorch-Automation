const fs = require('fs');
const path = require('path');

/**
 * Allure Utility Helper for enhanced reporting
 */
class AllureHelper {
  
  /**
   * Clean Allure results directory
   */
  static cleanResults() {
    const allureDir = path.join(process.cwd(), 'allure-results');
    const reportDir = path.join(process.cwd(), 'allure-report');
    
    // Clean results directory but keep environment.properties and categories.json
    if (fs.existsSync(allureDir)) {
      const files = fs.readdirSync(allureDir);
      files.forEach(file => {
        if (file !== 'environment.properties' && file !== 'categories.json' && file !== 'screenshots' && file !== 'videos') {
          const filePath = path.join(allureDir, file);
          if (fs.statSync(filePath).isDirectory()) {
            fs.rmSync(filePath, { recursive: true, force: true });
          } else {
            fs.unlinkSync(filePath);
          }
        }
      });
    }
    
    // Clean report directory
    if (fs.existsSync(reportDir)) {
      fs.rmSync(reportDir, { recursive: true, force: true });
    }
    
    console.log('Allure directories cleaned');
  }
  
  /**
   * Generate test execution summary
   */
  static generateExecutionSummary() {
    const resultsDir = path.join(process.cwd(), 'allure-results');
    const summaryFile = path.join(resultsDir, 'execution-summary.json');
    
    const summary = {
      executionDate: new Date().toISOString(),
      environment: 'QA',
      browser: 'Chrome',
      platform: 'Windows',
      testFramework: 'Cucumber + Playwright',
      reportFramework: 'Allure',
      baseUrl: 'https://qa-console.flotorch.cloud/',
      headlessMode: false,
      parallelExecution: false
    };
    
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log('Execution summary generated');
  }
  
  /**
   * Add custom executor info
   */
  static addExecutorInfo() {
    const resultsDir = path.join(process.cwd(), 'allure-results');
    const executorFile = path.join(resultsDir, 'executor.json');
    
    const executorInfo = {
      name: 'Local Execution',
      type: 'manual',
      url: 'http://localhost',
      buildOrder: Date.now(),
      buildName: `Test Run ${new Date().toLocaleDateString()}`,
      buildUrl: 'http://localhost',
      reportName: 'Flotorch QA Console Test Report',
      reportUrl: 'http://localhost/allure-report'
    };
    
    fs.writeFileSync(executorFile, JSON.stringify(executorInfo, null, 2));
    console.log('Executor info added');
  }
  
  /**
   * Setup Allure directories and files
   */
  static setup() {
    const resultsDir = path.join(process.cwd(), 'allure-results');
    const screenshotsDir = path.join(resultsDir, 'screenshots');
    const videosDir = path.join(resultsDir, 'videos');
    
    // Create directories if they don't exist
    [resultsDir, screenshotsDir, videosDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
    
    this.generateExecutionSummary();
    this.addExecutorInfo();
    
    console.log('Allure setup completed');
  }
  /**
   * Attach screenshot to Allure report
   * @param {Object} context - The Cucumber World context
   * @param {string} screenshotPath - Path to the screenshot file
   * @param {string} description - Description of the screenshot
   */
  static async attachScreenshotToAllure(context, screenshotPath, description) {
    try {
      // Make sure screenshot path is a string
      if (typeof screenshotPath !== 'string') {
        console.warn('Screenshot path must be a string');
        return;
      }

      // Check if the file exists
      if (!fs.existsSync(screenshotPath)) {
        console.warn(`Screenshot file not found: ${screenshotPath}`);
        return;
      }

      // Read screenshot file
      const screenshot = fs.readFileSync(screenshotPath);

      // Attach to allure
      context.attach(screenshot, 'image/png');
      context.attach(`Screenshot captured: ${description}`, 'text/plain');
      
      console.log(`Screenshot captured for step: ${description} -> ${screenshotPath}`);
    } catch (error) {
      console.warn(`Failed to attach screenshot: ${error.message}`);
    }
  }
}

module.exports = AllureHelper;
