const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');




When('I click on Create Experiment button', async function() {
  await this.experimentPage.clickCreateExperimentButton();
});

Then('I should see Create Experiment modal', async function() {
  const isModalVisible = await this.experimentPage.isCreateExperimentModalVisible();
  expect(isModalVisible).toBe(true, 'Create Experiment modal should be visible');
});

Then('Create Experiment button should be visible', async function() {
  const isButtonVisible = await this.experimentPage.isCreateButtonVisible();
  expect(isButtonVisible).toBe(true, 'Create Experiment button should be visible in the modal');
});
