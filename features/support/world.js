const { World } = require('@cucumber/cucumber');
const LoginPage = require('../../pages/LoginPage');
const DashboardPage = require('../../pages/DashboardPage');
const WorkspacePage = require('../../pages/WorkspacePage');
const ExperimentDashboardPage = require('../../pages/ExperimentDashboardPage');
const ExperimentPage = require('../../pages/ExperimentPage');
const ModelsPage = require('../../pages/ModelsPage');
const ProvidersPage = require('../../pages/ProvidersPage');
const KnowledgeBasePage = require('../../pages/KnowledgeBasePage');
const ProjectPage = require('../../pages/ProjectPage');

/**
 * Custom World class that provides access to page objects and common utilities
 */
class CustomWorld extends World {
  constructor(options) {
    super(options);
    
    // Test data
    this.testData = {
      validCredentials: {
        email: 'sravanthi.thota+1107@fissionlabs.com',
        password: 'Havisha@119'

      },
      invalidCredentials: {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      }
    };
  }

  /**
   * Initialize page objects
   * @param {Page} page - Playwright page object
   */
  initPageObjects(page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.dashboardPage = new DashboardPage(page);
    this.workspacePage = new WorkspacePage(page);
    this.experimentDashboardPage = new ExperimentDashboardPage(page);
    this.experimentPage = new ExperimentPage(page);
    this.modelsPage = new ModelsPage(page);
    this.providersPage = new ProvidersPage(page);
    this.knowledgeBasePage = new KnowledgeBasePage(page);
    this.projectPage = new ProjectPage(page);
    
    // For backward compatibility, also set basePage reference
    this.basePage = this.loginPage; // All pages inherit from BasePage
    
    console.log('Page objects initialized');
  }

  /**
   * Get test credentials
   * @param {string} type - Type of credentials ('valid' or 'invalid')
   * @returns {Object} Credentials object
   */
  getCredentials(type = 'valid') {
    if (type === 'valid') {
      return this.testData.validCredentials;
    } else if (type === 'invalid') {
      return this.testData.invalidCredentials;
    } else {
      throw new Error(`Unknown credential type: ${type}`);
    }
  }

  /**
   * Wait for a specified amount of time
   * @param {number} seconds - Time to wait in seconds
   */
  async waitForSeconds(seconds) {
    await this.page.waitForTimeout(seconds * 1000);
  }

  /**
   * Log message with timestamp
   * @param {string} message - Message to log
   */
  log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }
}

module.exports = CustomWorld;
