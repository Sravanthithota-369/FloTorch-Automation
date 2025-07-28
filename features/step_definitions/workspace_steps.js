const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const AllureHelper = require('../../utils/allure-helper');

const attachScreenshotToAllure = AllureHelper.attachScreenshotToAllure;

When('I click on {string} workspace', async function(workspaceName) {
    this.attach(`Clicking on workspace: ${workspaceName}`, 'text/plain');
    
    await this.workspacePage.clickWorkspace(workspaceName);
    
    this.log(`Clicked on workspace: ${workspaceName}`);
});

Then('I should see the {string} Dashboard', async function(workspaceName) {
    this.attach(`Verifying workspace dashboard: ${workspaceName}`, 'text/plain');
    
    // Verify the dashboard is displayed
    const isDashboardVisible = await this.workspacePage.verifyWorkspaceDashboard(workspaceName);
    expect(isDashboardVisible).toBe(true);
    
    this.log(`Verified workspace dashboard for: ${workspaceName}`);
});
