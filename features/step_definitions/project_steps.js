const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const path = require('path');

// Project steps

When('I click on Experiments menu', async function() {
  await this.projectPage.clickExperimentsMenu();
});

When('I click on Projects button', async function() {
  await this.projectPage.clickProjectsButton();
});

Then('I should see Projects page', async function() {
  await this.projectPage.verifyProjectsPage();
});

When('I click on Create Project button', async function() {
  await this.projectPage.clickCreateProjectButton();
});

Then('I should see Create Project modal', async function() {
  const isVisible = await this.projectPage.isCreateProjectModalVisible();
  expect(isVisible).toBeTruthy();
});

// Form filling steps
When('I fill in the Project Name with {string}', async function(projectName) {
  await this.projectPage.fillInput(this.projectPage.projectNameInputSelector, projectName);
});

When('I click on Knowledge Base dropdown', async function() {
  await this.projectPage.clickKnowledgeBaseDropdown();
});

When('I select {string} from Knowledge Base dropdown', async function(knowledgeBase) {
  await this.projectPage.selectKnowledgeBase(knowledgeBase);
});

When('I upload a file for Ground Truth File', async function() {
  // Using the new utility - just need to provide file name from testdata folder
  await this.projectPage.uploadGroundTruthFile('no_kb_gt.json');
});

When('I upload {string} for Ground Truth File', async function(fileName) {
  // Allow specifying a specific file name in the feature file
  await this.projectPage.uploadGroundTruthFile(fileName);
});

When('I select {string} from N Shot Prompts', async function(nShotPrompt) {
  await this.projectPage.selectNShotPrompts(nShotPrompt);
});

When('I upload a file for Shot Prompt File', async function() {
  // Using the new utility - just need to provide file name from testdata folder
  await this.projectPage.uploadShotPromptFile('no_kn_prompt.json');
});

When('I upload {string} for Shot Prompt File', async function(fileName) {
  // Allow specifying a specific file name in the feature file
  await this.projectPage.uploadShotPromptFile(fileName);
});

When('I fill in the System Prompt with {string}', async function(systemPrompt) {
  await this.projectPage.fillSystemPrompt(systemPrompt);
});

When('I fill in the User Prompt with {string}', async function(userPrompt) {
  await this.projectPage.fillUserPrompt(userPrompt);
});

When('I select {string} from Retrieval Models', async function(model) {
  await this.projectPage.selectRetrievalModel(model);
});

When('I set KNN Number to {string}', async function(knnNumber) {
  await this.projectPage.setKNNNumber(knnNumber);
});

When('I set Evaluation Service to {string}', async function(evaluationService) {
  await this.projectPage.setEvaluationService(evaluationService);
});

When('I select an Evaluation Model as {string}', async function(model) {
  await this.projectPage.selectEvaluationModel(model);
});

When('I select an Evaluation Embedding Model Provider as {string}', async function(provider) {
  await this.projectPage.selectEvaluationEmbeddingModelProvider(provider);
});

When('I set Evaluation Embedding Model to {string}', async function(embeddingModel) {
  await this.projectPage.setEvaluationEmbeddingModel(embeddingModel);
});

When('I click on Create Project submit button', async function() {
  await this.projectPage.submitCreateProjectForm();
});

Then('the project should be created successfully', async function() {
  const isSuccess = await this.projectPage.verifyProjectCreationSuccess();
  expect(isSuccess).toBeTruthy('Project creation success indicator not found');
});

// Take screenshot step
When('I take a screenshot of the Create Project modal', async function() {
  await this.projectPage.takeCreateProjectModalScreenshot('create-project-modal');
});
