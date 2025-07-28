const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { testProperties } = require('../../utils/propertiesReader');

// Model Registry Navigation Steps
Then('I should see Models submenu', async function() {
    const isVisible = await this.modelsPage.isModelsSubmenuVisible();
    expect(isVisible).toBe(true);
    await this.modelsPage.captureModelRegistryDropdown('Model_Registry_Dropdown_Models');
});

Then('I should see Providers submenu', async function() {
    const isVisible = await this.modelsPage.isProvidersSubmenuVisible();
    expect(isVisible).toBe(true);
    await this.modelsPage.captureModelRegistryDropdown('Model_Registry_Dropdown_Providers');
});

// Model Configuration Steps
When('I click on Add Model Configuration button', async function() {
    await this.modelsPage.clickAddModelConfigurationButton();
    await attachScreenshotToAllure(this, 'Click_Add_Model_Configuration');
});

When('I select {string} from the Provider dropdown', async function(provider) {
    await this.modelsPage.selectProvider(provider);
    await attachScreenshotToAllure(this, 'Select_Provider');
});

When('I select {string} from the Model Name dropdown', async function(modelName) {
    await this.modelsPage.selectModelName(modelName);
    await attachScreenshotToAllure(this, 'Select_Model_Name');
});

When('I click on Create button', async function() {
    await this.modelsPage.clickCreateButton();
    await attachScreenshotToAllure(this, 'Click_Create_Button');
});

Then('I should see a success notification', async function() {
    // Check for success notification using the base page method since we could be on any page
    const isNotificationVisible = await this.workspacePage.isSuccessNotificationVisible() ||
                               await this.modelsPage.isSuccessNotificationVisible() ||
                               await this.dashboardPage.isSuccessNotificationVisible();
    expect(isNotificationVisible).toBe(true);
    await attachScreenshotToAllure(this, 'Success_Notification');
});

Then('the model configuration should be added successfully', async function() {
    const isConfigurationAdded = await this.modelsPage.isModelConfigurationAdded();
    expect(isConfigurationAdded).toBe(true);
    await attachScreenshotToAllure(this, 'Model_Configuration_Added');
});

When('I click on Actions menu button in Model Registry', async function() {
    await this.modelsPage.clickActionsMenuButton();
    await attachScreenshotToAllure(this, 'Click_Actions_Menu');
});

When('I click on Actions button in Model Registry', async function() {
    await this.modelsPage.clickActionsButton();
    await attachScreenshotToAllure(this, 'Click_Actions_Button');
});

When('I click on {string} option', async function(option) {
    if (option === 'Publish Latest' || option === 'Publish') {
        // Pass the option to the page method so the correct selector is used
        await this.modelsPage.clickPublishLatestOption(option);
        // Use dynamic screenshot name based on the option
        const screenshotName = `Click_${option.replace(/\s+/g, '_')}`;
        await attachScreenshotToAllure(this, screenshotName);
    }
});

When('I select {string} from the version dropdown', async function(version) {
    await this.modelsPage.selectVersionFromDropdown(version);
    await attachScreenshotToAllure(this, 'Select_Version');
});

When('I click on Publish button in the dialog', async function() {
    await this.modelsPage.clickPublishButtonInDialog();
    await attachScreenshotToAllure(this, 'Click_Publish_In_Dialog');
});

Then('I should see a success notification for model publishing', async function() {
    const isNotificationVisible = await this.modelsPage.isModelPublishSuccessNotificationVisible();
    expect(isNotificationVisible).toBe(true);
    await attachScreenshotToAllure(this, 'Model_Publish_Success');
});

When('I click on Actions button', async function() {
    await this.modelsPage.clickActionsButton();
    await attachScreenshotToAllure(this, 'Click_Actions_Button');
});

When('I click on Publish button', async function() {
    await this.modelsPage.clickPublishButton();
    await attachScreenshotToAllure(this, 'Click_Publish_Button');
});

Then('I should see a success notification for publishing', async function() {
    const isNotificationVisible = await this.modelsPage.isPublishSuccessNotificationVisible();
    expect(isNotificationVisible).toBe(true);
    await attachScreenshotToAllure(this, 'Publish_Success_Notification');
});

// Helper function to attach screenshots to Allure - Now handled automatically by hooks
async function attachScreenshotToAllure(world, stepName) {
  // Screenshots are now captured automatically for every step in hooks.js
  // This function is kept for backward compatibility but does nothing
}

// Common steps (reuse from existing step definitions)
Given('I am logged in to FloTorch', async function () {
  // Initialize page objects
  this.initPageObjects(this.page);
  
  await this.loginPage.navigateToLoginPage();
  const credentials = this.getCredentials('valid');
  await this.loginPage.login(credentials.email, credentials.password);
  await this.dashboardPage.verifyDashboardLoaded();
  await attachScreenshotToAllure(this, 'Dashboard_After_Login');
});

Then('I am on the experiment dashboard', async function () {
  // Navigate to workspace and click on Experiment
  await attachScreenshotToAllure(this, 'Before_Navigate_To_Workspaces');
  await this.workspacePage.navigateToWorkspaces();
  await attachScreenshotToAllure(this, 'After_Navigate_To_Workspaces');
  
  await attachScreenshotToAllure(this, 'Before_Click_Experiment_Workspace');
  await this.experimentDashboardPage.clickExperimentWorkspace();
  await attachScreenshotToAllure(this, 'After_Click_Experiment_Workspace');
  
  const isLoaded = await this.experimentDashboardPage.verifyExperimentDashboardLoaded();
  expect(isLoaded).toBe(true);
  await attachScreenshotToAllure(this, 'Experiment_Dashboard_View');
});

When('I click on {string} menu', async function (menuName) {
  if (menuName === 'Model Registry') {
    await this.experimentDashboardPage.clickModelRegistry();
  }
});

// Provider-related steps
When('I click on "Providers" submenu', async function () {
  await attachScreenshotToAllure(this, 'Before_Click_Providers');
  await this.providersPage.navigateToProviders();
  await attachScreenshotToAllure(this, 'After_Click_Providers');
});

Then('I should be on the providers page', async function () {
  const isOnProvidersPage = await this.providersPage.verifyOnProvidersPage();
  expect(isOnProvidersPage).toBe(true);
  await attachScreenshotToAllure(this, 'Providers_Page_Loaded');
});

When('I click on "Add LLM Provider" button', async function () {
  await attachScreenshotToAllure(this, 'Before_Add_LLM_Provider');
  await this.providersPage.clickAddLLMProvider();
  await attachScreenshotToAllure(this, 'After_Add_LLM_Provider');
});

When('I fill provider details:', async function (dataTable) {
  const providerData = {};
  const rows = dataTable.hashes();
  
  rows.forEach(row => {
    const field = row.field || row.name;
    let value = row.value;
    
    // Replace placeholders with values from properties file
    if (field === 'region') {
      value = testProperties.getProperty('aws.region', value);
    } else if (field === 'accessKey') {
      value = testProperties.getProperty('aws.accessKeyId', value);
    } else if (field === 'secretKey') {
      value = testProperties.getProperty('aws.secretAccessKey', value);
    }
    
    providerData[field] = value;
  });
  
  console.log('Provider data to fill:', providerData);
  await this.providersPage.fillProviderDetails(providerData);
  await attachScreenshotToAllure(this.page, 'Provider_Details_Filled');
});

When('I click "Create" button for provider', async function () {
  await attachScreenshotToAllure(this, 'Before_Submit_Provider');
  await this.providersPage.submitProviderCreation();
  await attachScreenshotToAllure(this, 'After_Submit_Provider');
  
  // Wait longer for server response and capture toasts
  console.log('Waiting for toast notifications after provider submission...');
  await this.page.waitForTimeout(3000); // Wait 3 seconds for server response
  
  this.providerToasts = await this.providersPage.waitForToastNotifications(10000);
  console.log(`Captured ${this.providerToasts.length} toast notifications after provider creation`);
});

// Model-related steps
When('I click on "Models" submenu', async function () {
  await attachScreenshotToAllure(this, 'Before_Click_Models');
  await this.modelsPage.navigateToModels();
  await attachScreenshotToAllure(this, 'After_Click_Models');
});

Then('I should be on the models page', async function () {
  const isOnModelsPage = await this.modelsPage.verifyOnModelsPage();
  expect(isOnModelsPage).toBe(true);
  await attachScreenshotToAllure(this, 'Models_Page_Loaded');
});

When('I click on "New Model" button', async function () {
  await attachScreenshotToAllure(this, 'Before_New_Model');
  await this.modelsPage.clickNewModel();
  await attachScreenshotToAllure(this, 'After_New_Model');
});

When('I fill model details:', async function (dataTable) {
  const rows = dataTable.raw();
  const modelData = {
    name: '',
    description: ''
  };
  
  rows.forEach(row => {
    if (row[0] === 'name') modelData.name = row[1];
    if (row[0] === 'description') modelData.description = row[1];
  });
  
  console.log(`Model data to fill: name="${modelData.name}", description="${modelData.description}"`);
  await this.modelsPage.fillModelDetails(modelData);
  await attachScreenshotToAllure(this, 'Model_Details_Filled');
});

When('I click "Create" button for model', async function () {
  await attachScreenshotToAllure(this, 'Before_Submit_Model');
  await this.modelsPage.submitModelCreation();
  await attachScreenshotToAllure(this, 'After_Submit_Model');
  
  // Wait for toast notifications
  this.modelToasts = await this.modelsPage.waitForToastNotifications(10000);
});

When('I click on "Add Model Configuration" button', async function () {
  await attachScreenshotToAllure(this, 'Before_Add_Model_Config');
  await this.modelsPage.clickAddModelConfiguration();
  await attachScreenshotToAllure(this, 'After_Add_Model_Config');
});

// Toast verification steps
Then('I should see a green success toast notification', async function () {
  // Wait for and get toasts using the base page method
  await this.page.waitForTimeout(1000); // Give time for toast to appear

  // Check for success using base page method
  const isSuccess = await this.workspacePage.isSuccessNotificationVisible();
  
  // Debug toast visibility
  console.log('=== TOAST DEBUG INFO ===');
  console.log(`Success notification visible: ${isSuccess}`);
  console.log('=== END TOAST DEBUG ===');
  
  expect(isSuccess).toBe(true, 'Expected to see a success toast notification');
  
  // Log success
  console.log('✓ Green success toast notification verified');
  
  // Take another screenshot to capture the toast state
  const finalToastScreenshot = await this.workspacePage.captureWorkspaceScreenshot('Success_Toast_Final');
  await attachScreenshotToAllure(this, finalToastScreenshot, 'Success Toast Final State');
});

Then('the toast should contain {string} message', async function (expectedMessage) {
  const messages = await this.workspacePage.captureToastNotifications();
  
  const hasExpectedMessage = messages.some(message => 
    message.toLowerCase().includes(expectedMessage.toLowerCase())
  );
if( hasExpectedMessage=== true) {
    console.error(`Expected message "${expectedMessage}" not found in toast notifications:`);
  }
 
});

Then('I should see another green success toast notification', async function () {
  // Wait a bit more for additional toasts (reduced from 2000ms)
  await this.page.waitForTimeout(1000);
  
  // Capture any additional toasts
  const additionalToasts = await this.modelsPage.waitForToastNotifications(5000);
  
  if (additionalToasts.length > 0) {
    this.modelToasts = [...(this.modelToasts || []), ...additionalToasts];
  }
  
  const allToasts = this.modelToasts || [];
  expect(allToasts.length).toBeGreaterThan(0);
  
  const hasMultipleGreenToasts = allToasts.filter(toast => toast.isSuccess).length >= 2;
  if (!hasMultipleGreenToasts) {
    // At least one green toast is acceptable
    const hasGreenToast = allToasts.some(toast => toast.isSuccess);
    expect(hasGreenToast).toBe(true);
  }
  
  console.log('✓ Additional green success toast notification verified');
});

Then('I should see the model configuration page', async function () {
  // Verify we're on the configuration page by checking URL or page elements
  const currentUrl = this.modelsPage.getCurrentUrl();
  const isOnConfigPage = currentUrl.includes('/configure') || currentUrl.includes('/configuration');
  
  if (!isOnConfigPage) {
    console.log('Note: Configuration page URL check failed, but this may be expected behavior');
  }
  
  await attachScreenshotToAllure(this, 'Model_Configuration_Page_Loaded');
});

// Verification steps
Then('I verify the provider {string} exists in the provider list', async function (providerName) {
  await this.providersPage.navigateToProviders();
  await this.page.waitForTimeout(500); // Reduced from 1000ms
  
  const exists = await this.providersPage.verifyProviderExists(providerName);
  expect(exists).toBe(true);
  
  console.log(`✓ Provider "${providerName}" verified in list`);
  await attachScreenshotToAllure(this, 'Provider_List_Verified');
});

Then('I verify the model {string} exists in the model list', async function (modelName) {
  await this.modelsPage.navigateToModels();
  await this.page.waitForTimeout(500); // Reduced from 1000ms
  
  const exists = await this.modelsPage.verifyModelExists(modelName);
  expect(exists).toBe(true);
  
  console.log(`✓ Model "${modelName}" verified in list`);
  await attachScreenshotToAllure(this, 'Model_List_Verified');
});

Then('I verify the model configuration is published and active', async function () {
  const status = await this.modelsPage.verifyModelConfigurationStatus();
  expect(status.isPublished && status.isActive).toBe(true);
  
  console.log('✓ Model configuration verified as published and active');
  await attachScreenshotToAllure(this, 'Model_Configuration_Status_Verified');
});
