const BasePage = require('./BasePage');

/**
 * Experiment Dashboard Page Object - Handles experiment workspace dashboard functionality
 */
class ExperimentDashboardPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Experiment workspace navigation selectors
    this.experimentWorkspaceSelectors = [
      'a:has-text("Experiment")',
      '[data-testid="workspace-experiment"]',
      'tr:has-text("Experiment") a',
      '.workspace-item:has-text("Experiment")'
    ];
    
    // Dashboard verification selectors
    this.experimentDashboardSelectors = [
      'h1:has-text("Experiment Dashboard")',
      '[data-testid="experiment-dashboard"]',
      'main:has-text("Experiment Dashboard")',
      '.dashboard-header:has-text("Experiment")'
    ];
    
    // Model Registry menu selectors
    this.modelRegistryMenuSelectors = [
      'text=Model Registry',
      'a:has-text("Model Registry")',
      '.sidebar *:has-text("Model Registry")',
      '[data-testid="model-registry-menu"]',
      'nav a[href*="model-registry"]',
      '.side-nav a:has-text("Model Registry")',
      '.navigation a:has-text("Model Registry")'
    ];
    
    // Models submenu selectors
    this.modelsSubmenuSelectors = [
      'a:has-text("Models")',
      '[data-testid="models-menu"]',
      'nav a[href*="models"]',
      '.sidebar a:has-text("Models")'
    ];
    
    // Providers submenu selectors
    this.providersSubmenuSelectors = [
      'a:has-text("Providers")',
      '[data-testid="providers-menu"]',
      'nav a[href*="providers"]',
      '.sidebar a:has-text("Providers")'
    ];
    
    // Dashboard elements selectors
    this.dashboardElementSelectors = [
      '.dashboard-widget',
      '.chart-container',
      '.dashboard-card',
      '[data-testid="dashboard-element"]'
    ];
    
    // Sidebar navigation selectors
    this.sidebarSelectors = [
      '.sidebar',
      '[data-testid="sidebar"]',
      'nav.side-navigation',
      '.navigation-panel'
    ];
    
    // Chart/Graph selectors
    this.chartSelectors = [
      '.recharts-wrapper',
      '.chart',
      'canvas',
      'svg'
    ];
    
    // Model Registry page elements
    this.modelRegistryPageSelectors = [
      'h1:has-text("Models")',
      'h1:has-text("Model Registry")',
      '[data-testid="models-page"]',
      '.models-container'
    ];
    
    // Providers page elements
    this.providersPageSelectors = [
      'h1:has-text("Providers")',
      '[data-testid="providers-page"]',
      '.providers-container',
      '.provider-list'
    ];
  }

  /**
   * Click on the Experiment workspace to navigate into it
   */
  async clickExperimentWorkspace() {
    await this.clickElement(this.experimentWorkspaceSelectors);
    await this.page.waitForLoadState('networkidle');
    console.log('Clicked on Experiment workspace');
  }

  /**
   * Verify that the Experiment Dashboard is displayed
   * @returns {boolean} True if experiment dashboard is visible
   */
  async verifyExperimentDashboardLoaded() {
    try {
      // Check for dashboard title/header
      for (const selector of this.experimentDashboardSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 5000 });
          console.log(`Experiment dashboard found with selector: ${selector}`);
          
          // Additional verification - check URL
          const currentUrl = this.getCurrentUrl();
          console.log(`Current URL: ${currentUrl}`);
          
          // Check page title
          const pageTitle = await this.page.title();
          console.log(`Page title: ${pageTitle}`);
          
          return true;
        } catch (error) {
          continue;
        }
      }
      
      // If no specific dashboard selector found, check if URL contains experiment
      const currentUrl = this.getCurrentUrl();
      if (currentUrl.toLowerCase().includes('experiment')) {
        console.log('Experiment dashboard verified by URL pattern');
        return true;
      }
      
      console.log('Could not verify experiment dashboard');
      return false;
    } catch (error) {
      console.log(`Error verifying experiment dashboard: ${error.message}`);
      return false;
    }
  }

  /**
   * Click on Model Registry in the sidebar
   */
  async clickModelRegistry() {
    // First, let's debug what's available in the sidebar
    try {
      const sidebarElements = await this.page.$$('.sidebar *, nav *, [role="navigation"] *');
      console.log(`Found ${sidebarElements.length} elements in navigation areas`);
      
      // Get text content of navigation elements
      for (let i = 0; i < Math.min(sidebarElements.length, 10); i++) {
        try {
          const text = await sidebarElements[i].textContent();
          const tagName = await sidebarElements[i].evaluate(node => node.tagName);
          if (text && text.trim()) {
            console.log(`Nav element ${i}: ${tagName} - "${text.trim()}"`);
          }
        } catch (error) {
          continue;
        }
      }
      
      // Look for any element containing "Model" text
      const modelElements = await this.page.$$('*:has-text("Model")');
      console.log(`Found ${modelElements.length} elements containing "Model"`);
      
      for (let i = 0; i < Math.min(modelElements.length, 5); i++) {
        try {
          const text = await modelElements[i].textContent();
          const tagName = await modelElements[i].evaluate(node => node.tagName);
          console.log(`Model element ${i}: ${tagName} - "${text?.trim()}"`);
        } catch (error) {
          continue;
        }
      }
    } catch (error) {
      console.log('Could not debug sidebar elements:', error.message);
    }
    
    await this.clickElement(this.modelRegistryMenuSelectors);
    await this.page.waitForTimeout(300); // Wait for any submenu to expand (reduced from 1000ms)
    console.log('Clicked on Model Registry menu');
  }

  /**
   * Click on Models submenu
   */
  async clickModelsSubmenu() {
    await this.clickElement(this.modelsSubmenuSelectors);
    await this.page.waitForLoadState('networkidle');
    console.log('Clicked on Models submenu');
  }

  /**
   * Click on Providers submenu
   */
  async clickProvidersSubmenu() {
    await this.clickElement(this.providersSubmenuSelectors);
    await this.page.waitForLoadState('networkidle');
    console.log('Clicked on Providers submenu');
  }

  /**
   * Verify Models page is displayed
   * @returns {boolean} True if models page is visible
   */
  async verifyModelsPageLoaded() {
    try {
      for (const selector of this.modelRegistryPageSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 5000 });
          console.log(`Models page found with selector: ${selector}`);
          return true;
        } catch (error) {
          continue;
        }
      }
      
      // Check URL pattern
      const currentUrl = this.getCurrentUrl();
      if (currentUrl.includes('models') || currentUrl.includes('model-registry')) {
        console.log('Models page verified by URL pattern');
        return true;
      }
      
      return false;
    } catch (error) {
      console.log(`Error verifying models page: ${error.message}`);
      return false;
    }
  }

  /**
   * Verify Providers page is displayed
   * @returns {boolean} True if providers page is visible
   */
  async verifyProvidersPageLoaded() {
    try {
      for (const selector of this.providersPageSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 5000 });
          console.log(`Providers page found with selector: ${selector}`);
          return true;
        } catch (error) {
          continue;
        }
      }
      
      // Check URL pattern
      const currentUrl = this.getCurrentUrl();
      if (currentUrl.includes('providers')) {
        console.log('Providers page verified by URL pattern');
        return true;
      }
      
      return false;
    } catch (error) {
      console.log(`Error verifying providers page: ${error.message}`);
      return false;
    }
  }

  /**
   * Verify sidebar navigation elements are visible
   * @returns {boolean} True if sidebar is visible with navigation elements
   */
  async verifySidebarNavigation() {
    try {
      // Check if sidebar is visible
      for (const selector of this.sidebarSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 5000 });
          console.log(`Sidebar found with selector: ${selector}`);
          
          // Check if Model Registry menu is visible in sidebar
          const modelRegistryVisible = await this.isElementVisible(this.modelRegistryMenuSelectors[0]) ||
                                      await this.isElementVisible(this.modelRegistryMenuSelectors[1]);
          
          console.log(`Model Registry menu visible in sidebar: ${modelRegistryVisible}`);
          return true;
        } catch (error) {
          continue;
        }
      }
      
      return false;
    } catch (error) {
      console.log(`Error verifying sidebar navigation: ${error.message}`);
      return false;
    }
  }

  /**
   * Verify dashboard charts/widgets are displayed
   * @returns {boolean} True if dashboard elements are visible
   */
  async verifyDashboardElements() {
    try {
      let elementsFound = 0;
      
      // Check for dashboard widgets/cards
      for (const selector of this.dashboardElementSelectors) {
        try {
          const elements = await this.page.$$(selector);
          if (elements.length > 0) {
            elementsFound += elements.length;
            console.log(`Found ${elements.length} dashboard elements with selector: ${selector}`);
          }
        } catch (error) {
          continue;
        }
      }
      
      // Check for charts specifically
      for (const selector of this.chartSelectors) {
        try {
          const charts = await this.page.$$(selector);
          if (charts.length > 0) {
            elementsFound += charts.length;
            console.log(`Found ${charts.length} charts with selector: ${selector}`);
          }
        } catch (error) {
          continue;
        }
      }
      
      console.log(`Total dashboard elements found: ${elementsFound}`);
      return elementsFound > 0;
    } catch (error) {
      console.log(`Error verifying dashboard elements: ${error.message}`);
      return false;
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
   * Take screenshot with experiment dashboard context
   * @param {string} stepName - Name of the step for screenshot
   * @returns {string} Screenshot file path
   */
  async captureExperimentScreenshot(stepName) {
    return await this.captureScreenshotForAllure(`Experiment_${stepName}`);
  }

  /**
   * Navigate back to workspaces list
   */
  async navigateBackToWorkspaces() {
    // Try to find and click a "back" or "workspaces" link
    const backSelectors = [
      'a:has-text("Workspaces")',
      '[data-testid="back-to-workspaces"]',
      '.breadcrumb a:has-text("Workspaces")',
      'nav a[href*="workspaces"]'
    ];
    
    try {
      await this.clickElement(backSelectors);
      await this.page.waitForLoadState('networkidle');
      console.log('Navigated back to workspaces');
    } catch (error) {
      console.log('Could not find back navigation, using URL navigation');
      await this.page.goto('https://qa-console.flotorch.cloud/admin/workspaces');
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Complete experiment dashboard verification workflow
   */
  async verifyExperimentWorkflow() {
    const results = {
      dashboardLoaded: false,
      sidebarVisible: false,
      dashboardElements: false,
      modelRegistryAccessible: false,
      modelsPageAccessible: false,
      providersPageAccessible: false
    };

    try {
      // Verify dashboard loaded
      results.dashboardLoaded = await this.verifyExperimentDashboardLoaded();
      
      // Verify sidebar navigation
      results.sidebarVisible = await this.verifySidebarNavigation();
      
      // Verify dashboard elements
      results.dashboardElements = await this.verifyDashboardElements();
      
      // Test Model Registry navigation
      try {
        await this.clickModelRegistry();
        results.modelRegistryAccessible = true;
        
        // Test Models submenu
        try {
          await this.clickModelsSubmenu();
          results.modelsPageAccessible = await this.verifyModelsPageLoaded();
        } catch (error) {
          console.log('Could not access Models page:', error.message);
        }
        
        // Test Providers submenu
        try {
          await this.clickProvidersSubmenu();
          results.providersPageAccessible = await this.verifyProvidersPageLoaded();
        } catch (error) {
          console.log('Could not access Providers page:', error.message);
        }
        
      } catch (error) {
        console.log('Could not access Model Registry:', error.message);
      }
      
    } catch (error) {
      console.log('Error in experiment workflow verification:', error.message);
    }

    console.log('Experiment workflow verification results:', results);
    return results;
  }
}

module.exports = ExperimentDashboardPage;
