const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const AllureHelper = require('../../utils/allure-helper');

const attachScreenshotToAllure = AllureHelper.attachScreenshotToAllure;

When('I click on {string} workspace', async function(workspaceName) {
    this.attach(`Clicking on workspace: ${workspaceName}`, 'text/plain');
    
    // Take screenshot before clicking
    const beforeScreenshot = await this.workspacePage.captureWorkspaceScreenshot('Before_Click_Workspace');
    await attachScreenshotToAllure(this, beforeScreenshot, 'Before Click Workspace');
    
    await this.workspacePage.clickWorkspace(workspaceName);
    
    // Take screenshot after clicking
    const afterScreenshot = await this.workspacePage.captureWorkspaceScreenshot('After_Click_Workspace');
    await attachScreenshotToAllure(this, afterScreenshot, 'After Click Workspace');
    
    this.log(`Clicked on workspace: ${workspaceName}`);
});

Then('I should see the {string} Dashboard', async function(workspaceName) {
    this.attach(`Verifying workspace dashboard: ${workspaceName}`, 'text/plain');
    
    // Take screenshot of the dashboard
    const dashboardScreenshot = await this.workspacePage.captureWorkspaceScreenshot('Workspace_Dashboard');
    await attachScreenshotToAllure(this, dashboardScreenshot, 'Workspace Dashboard View');
    
    // Verify the dashboard is displayed
    const isDashboardVisible = await this.workspacePage.verifyWorkspaceDashboard(workspaceName);
    expect(isDashboardVisible).toBe(true);
    
    this.log(`Verified workspace dashboard for: ${workspaceName}`);
});
