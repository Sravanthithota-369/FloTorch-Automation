// KnowledgeBase step definitions - Empty template

const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Step definitions for Knowledge Base feature
Given('I click on Knowledge Bases menu', async function () {
  await this.knowledgeBasePage.clickKnowledgeBasesMenu();
});

Then('I should see Repository submenu', async function () {
  const visible = await this.knowledgeBasePage.isElementVisible(this.knowledgeBasePage.repositorySubmenuSelector);
  expect(visible).toBe(true);
});

Then('I should see Knowledge base Providers submenu', async function () {
  const visible = await this.knowledgeBasePage.isElementVisible(this.knowledgeBasePage.providersSubmenuSelector);
  expect(visible).toBe(true);
});

When('I click on knowledge base providers submenu', async function () {
  await this.knowledgeBasePage.clickProvidersSubmenu();
});

Then('I should be on the knowledge base providers page', async function () {
  const onPage = await this.knowledgeBasePage.verifyOnProvidersPage();
  expect(onPage).toBe(true);
});

When('I click on {string} button', async function (buttonText) {
  if (buttonText === 'Add Vector Storage Provider') {
    await this.knowledgeBasePage.clickAddProvider();
  } else if (buttonText === 'Add KB') {
    await this.knowledgeBasePage.clickAddKB();
  }
});

Then('I should see {string} modal', async function (modalTitle) {
  const header = modalTitle.includes('Provider') ?
    this.knowledgeBasePage.providerModalHeader :
    this.knowledgeBasePage.kbModalHeader;
  const visible = await this.knowledgeBasePage.isElementVisible(header);
  expect(visible).toBe(true);
});

// Keep old step definition for backwards compatibility
When('I fill provider details:', async function (dataTable) {
  console.log('EXECUTING: I fill provider details step (legacy)');
  await fillProviderDetailsHelper.call(this, dataTable);
});

// Add new step definition to match updated feature file
When('I fill knowledge base provider details:', async function (dataTable) {
  console.log('EXECUTING: I fill knowledge base provider details step (new)');
  await fillProviderDetailsHelper.call(this, dataTable);
});

// Helper function to avoid code duplication
async function fillProviderDetailsHelper(dataTable) {
  try {
    // Check if knowledgeBasePage is properly initialized
    if (!this.knowledgeBasePage) {
      console.error('ERROR: knowledgeBasePage is not initialized!');
      throw new Error('knowledgeBasePage is not initialized');
    }
    
    // Parse table into key/value pairs
    const rows = dataTable.hashes();
    console.log('Data table rows:', JSON.stringify(rows));
    
    const data = {};
    rows.forEach(row => {
      const field = row.field.trim();
      const value = row.value.trim();
      data[field] = value;
    });
    
    console.log('Parsed provider data:', JSON.stringify(data));
    console.log('About to call fillProviderDetails method');
    
    // Check if the method exists
    if (typeof this.knowledgeBasePage.fillProviderDetails !== 'function') {
      console.error('ERROR: fillProviderDetails method does not exist!');
      throw new Error('fillProviderDetails method is not defined');
    }
    
    await this.knowledgeBasePage.fillProviderDetails(data);
    console.log('Successfully filled provider details');
  } catch (error) {
    console.error('ERROR in fill provider details step:', error.message);
    throw error;
  }
}

When('I click {string} button for provider', async function (buttonText) {
  await this.knowledgeBasePage.submitProviderCreation();
});

When('I click on Repositories submenu', async function () {
  await this.knowledgeBasePage.clickRepositorySubmenu();
});

Then('I should be on the repositories page', async function () {
  const onPage = await this.knowledgeBasePage.verifyOnRepositoryPage();
  expect(onPage).toBe(true);
});

When('I fill knowledge base details:', async function (dataTable) {
  // Parse table into key/value pairs
  const rows = dataTable.hashes();
  const data = {};
  rows.forEach(row => {
    const field = row.field.trim();
    const value = row.value.trim();
    data[field] = value;
  });
  await this.knowledgeBasePage.fillKBDetails(data);
});

Then('I should see Add Vector Storage Provider modal', async function () {
  const visible = await this.knowledgeBasePage.isVectorStorageMenuVisible();
  expect(visible).toBe(true);
});

Then('I should see Add Knowledge Base modal', async function () {
  const visible = await this.knowledgeBasePage.isAddKBModalVisible();
  expect(visible).toBe(true);
});
