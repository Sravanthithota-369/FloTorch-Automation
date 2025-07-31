const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');
const fileUploadUtils = require('../utils/fileUploadUtils');

/**
 * Page object representing the Projects page
 */
class ProjectPage extends BasePage {
  constructor(page) {
    super(page);
  
    this.experimentsMenuSelector = [
      'text=Experiments',
      '[href*="/experiments"]',
      '.side-nav a:has-text("Experiments")',
      '//span[contains(text(), "Experiments")]',
      '.i-lucide\\:layout-dashboard ~ span:has-text("Experiments")'
    ];
    this.projectsButtonSelector = [
      'text=Projects',
      'a[href*="/projects"]',
      '.side-nav a:has-text("Projects")',
      '//span[contains(text(), "Projects")]',
      '.i-token\\:ait ~ span:has-text("Projects")'
    ];
    this.projectsPageHeaderSelector = [
      'h1:has-text("Projects")',
      '.page-header:has-text("Projects")',
      '//h1[text()="Projects"]'
    ];
    
    this.createProjectButtonSelector = [
      'text=Create Project',
      'button:has-text("Create Project")',
      'a:has-text("Create Project")',
      '[data-testid="create-project-button"]',
      '.create-button',
      '.primary-btn',
      'button.btn-primary'
    ];

    this.createProjectModalSelector = [
      'h1:has-text("Create Project")',
      'text=Create Project',
      'form#v-1-220',
      '.card-shadow:has-text("Create Project")'
    ];

    // Form field selectors from the screenshot
    this.projectNameInputSelector = [
      'input[name="name"]',
      'input#v-1-21',
      'label:has-text("Project Name") >> input',
      '[data-testid="project-name-input"]'
    ];

    this.knowledgeBaseList = [
        '//div[@role="listbox"]'
    ]
    this.knowledgeBaseDropdownSelector = [
      '//label[text()="Knowledge Base"]//following::div[1]/button'
    ];

    this.selectKnowledgeBaseOption = [
        '//input[@placeholder="Search..."]'
    ]

    this.groundTruthFileInputSelector = [
      'input[type="file"][name="groundTruthFile"]',
      '[data-testid="ground-truth-file-input"]',
      'input[type="file"]:near(:text("Ground Truth File"))'
    ];

    this.chooseFileButtonSelector = [
      'button:has-text("Choose File")',
      '[data-testid="choose-file-button"]'
    ];

    this.nShotPromptsDropdownSelector = [
      '//label[contains(normalize-space(.),"N Shot Prompts")]//following::div[1]//button',
      'label:has-text("N Shot Prompts") >> button',
      'button:has-text("N Shot Prompts")'
    ];

    this.shotPromptFileInputSelector = [
      '//label[text()="Shot Prompt File"]//following::div[1]//button'
    ];

    this.systemPromptInputSelector = [
      'input[name="systemPrompt"]',
      '[data-testid="system-prompt-input"]',
      'textarea[name="systemPrompt"]'
    ];

    this.userPromptInputSelector = [
      'input[name="userPrompt"]',
      '[data-testid="user-prompt-input"]',
      'textarea[name="userPrompt"]'
    ];

    this.retrievalModelsDropdownSelector = [
      '//label[text()="Retrieval Models"]//following::div[1]//button'
    ];

    this.knnNumberInputSelector = [
      '//label[text()="KNN Number"]//following::div[1]//button'
    ];

    this.evaluationServiceInputSelector = [
      'input[name="evaluationService"]',
      '[data-testid="evaluation-service-input"]'
    ];

    this.evaluationModelDropdownSelector = [
      '//label[text()="Evaluation Model"]//following::div[1]//button'
    ];

    this.evaluationEmbeddingModelProviderDropdownSelector = [
      '//label[text()="Evaluation Embedding Model Provider"]//following::div[1]//button'
    ];

    this.evaluationEmbeddingModelInputSelector = [
      '//label[text()="Evaluation Embedding Model"]//following::div//input'
    ];

    this.createProjectSubmitButtonSelector = [
      '//span[text()="Create Project"]//ancestor::button'
    ];
  }

  async clickExperimentsMenu()
  {
    await this.clickElement(this.experimentsMenuSelector);
    console.log('Clicked on Experiments menu');
  }

  async clickProjectsButton() {
    await this.clickElement(this.projectsButtonSelector);
    console.log('Clicked on Projects button');
  }
  
  /**
   * Click the Create Project button on Projects page
   */
  async clickCreateProjectButton() {
    await this.clickElement(this.createProjectButtonSelector);
    console.log('Clicked on Create Project button');
  }
  
  /**
   * Check if the Create Project modal is visible
   * @returns {Promise<boolean>} True if visible
   */
  async isCreateProjectModalVisible() {
    const isVisible = await this.isElementVisible(this.createProjectModalSelector);
    console.log(`Create Project modal visible: ${isVisible}`);
    return isVisible;
  }
  
  /**
   * Click the Knowledge Base dropdown
   */
  async clickKnowledgeBaseDropdown() {
    await this.clickElement(this.knowledgeBaseDropdownSelector);
    console.log('Clicked on Knowledge Base dropdown');
  }
  
  /**
   * Select a Knowledge Base by visible text
   * @param {string} value
   */
  async selectKnowledgeBase(value) {
    // Try native <select> first
    try {
        await this.page.waitForSelector(this.knowledgeBaseList[0], { timeout: 3000 });
      await this.page.selectOption(this.knowledgeBaseDropdownSelector[0], value);
      console.log(`Selected ${value} via selectOption`);
      return;
    } catch (err) {
      console.log(`selectOption for Knowledge Base failed: ${err.message}`);
    }
    // Fallback: custom dropdown

    //await this.page.waitForSelector(this.knowledgeBaseList[0], { timeout: 3000 });
    await this.page.waitForSelector('[role="option"]', { timeout: 5000 }).catch(() => {});
    //await this.page.getByRole('option', { name: value }).click();
    // Fallback: click search input, type the value, and press Enter
    await this.clickElement(this.selectKnowledgeBaseOption);
    console.log('Clicked on Knowledge Base search input');
    await this.page.fill(this.selectKnowledgeBaseOption[0], value);
    await this.page.keyboard.press('Enter');
    console.log(`Selected ${value} via search input and Enter`);
  }
  
  /**
   * Upload a file for Ground Truth File
   * @param {string} filePath - Path to the file to upload
   */
  async uploadGroundTruthFile(filePath = 'no_kb_gt.json') {
    try {
      await fileUploadUtils.uploadGroundTruthFile(this.page, filePath);
      console.log(`Successfully uploaded Ground Truth File: ${filePath}`);
      
      // Take screenshot for verification
      await this.takeScreenshot('After_Uploading_Ground_Truth_File');
    } catch (error) {
      console.error(`Failed to upload Ground Truth File: ${error.message}`);
      await this.takeScreenshot('Ground_Truth_File_Upload_Failed');
      throw error;
    }
  }
  
  /**
   * Select N Shot Prompts value
   * @param {string} value - Value to select
   */
  async selectNShotPrompts(value) {
    // Try native <select> first
    try {
      await this.page.selectOption(this.nShotPromptsDropdownSelector[0], value);
      console.log(`Selected ${value} from N Shot Prompts via selectOption`);
      return;
    } catch (selectError) {
      console.log(`selectOption for N Shot Prompts failed: ${selectError.message}`);
    }
    // Fallback: handle as custom dropdown
    await this.clickElement(this.nShotPromptsDropdownSelector);
    console.log('Clicked on N Shot Prompts dropdown');
    await this.page.waitForSelector('[role="option"]', { timeout: 5000 }).catch(() => {});
    // Try Playwright role selector
    try {
      await this.page.getByRole('option', { name: value }).click();
      console.log(`Selected ${value} via getByRole('option')`);
      return;
    } catch (roleError) {
      console.log(`getByRole for N Shot Prompts failed: ${roleError.message}`);
    }
    // Fallback selectors for option click
    const fallbackSelectors = [
      `text=${value}`,
      `[role="option"]:has-text("${value}")`,
      `li:has-text("${value}")`,
      `.dropdown-item:has-text("${value}")`
    ];
    await this.clickElement(fallbackSelectors);
    console.log(`Selected ${value} from N Shot Prompts via fallback selectors`);
  }
  
  /**
   * Upload Shot Prompt File
   * @param {string} filePath - Path to the file to upload
   */
  async uploadShotPromptFile(filePath = 'no_kn_prompt.json') {
    try {
      await fileUploadUtils.uploadShotPromptFile(this.page, filePath);
      console.log(`Successfully uploaded Shot Prompt File: ${filePath}`);
      
      // Take screenshot for verification
      await this.takeScreenshot('After_Uploading_Shot_Prompt_File');
    } catch (error) {
      console.error(`Failed to upload Shot Prompt File: ${error.message}`);
      await this.takeScreenshot('Shot_Prompt_File_Upload_Failed');
      throw error;
    }
  }
  
  /**
   * Fill System Prompt field
   * @param {string} prompt - System prompt text
   */
  async fillSystemPrompt(prompt) {
    await this.fillInput(this.systemPromptInputSelector, prompt);
    console.log(`Filled System Prompt with: ${prompt}`);
  }
  
  /**
   * Fill User Prompt field
   * @param {string} prompt - User prompt text
   */
  async fillUserPrompt(prompt) {
    await this.fillInput(this.userPromptInputSelector, prompt);
    console.log(`Filled User Prompt with: ${prompt}`);
  }
  
  /**
   * Select a Retrieval Model
   * @param {string} model - The model to select
   */
  async selectRetrievalModel(model) {
    // Click on the dropdown first
    await this.clickElement(this.retrievalModelsDropdownSelector);
    
    // Build selectors for the desired option
    const optionSelectors = [
      `option[value="${model}"]`,
      `li.dropdown-item:has-text("${model}")`,
      `.dropdown-item:has-text("${model}")`
    ];
    
    await this.clickElement(optionSelectors);
    console.log(`Selected Retrieval Model: ${model}`);
  }
  
  /**
   * Set KNN Number
   * @param {string} number - KNN number
   */
  async setKNNNumber(number) {
    await this.fillInput(this.knnNumberInputSelector, number);
    console.log(`Set KNN Number to: ${number}`);
  }
  
  /**
   * Set Evaluation Service
   * @param {string} service - Service name
   */
  async setEvaluationService(service) {
    await this.fillInput(this.evaluationServiceInputSelector, service);
    console.log(`Set Evaluation Service to: ${service}`);
  }
  
  /**
   * Select an Evaluation Model
   * @param {string} model - The evaluation model to select
   */
  async selectEvaluationModel(model) {
    // Click on the dropdown first
    await this.clickElement(this.evaluationModelDropdownSelector);
    
    // Build selectors for the desired option
    const optionSelectors = [
      `option[value=\"${model}\"]`,
      `li.dropdown-item:has-text(\"${model}\")`,
      `.dropdown-item:has-text(\"${model}\")`
    ];
    
    await this.clickElement(optionSelectors);
    console.log(`Selected Evaluation Model: ${model}`);
  }
  
  /**
   * Select an Evaluation Embedding Model Provider
   * @param {string} provider - The embedding model provider to select
   */
  async selectEvaluationEmbeddingModelProvider(provider) {
    // Click on the dropdown first
    await this.clickElement(this.evaluationEmbeddingModelProviderDropdownSelector);
    
    // Build selectors for the desired provider
    const optionSelectors = [
      `option[value=\"${provider}\"]`,
      `li.dropdown-item:has-text(\"${provider}\")`,
      `.dropdown-item:has-text(\"${provider}\")`
    ];
    
    await this.clickElement(optionSelectors);
    console.log(`Selected Evaluation Embedding Model Provider: ${provider}`);
  }
  
  /**
   * Set Evaluation Embedding Model
   * @param {string} model - Model name
   */
  async setEvaluationEmbeddingModel(model) {
    await this.fillInput(this.evaluationEmbeddingModelInputSelector, model);
    console.log(`Set Evaluation Embedding Model to: ${model}`);
  }
  
  /**
   * Verify project creation success
   * @returns {Promise<boolean>} True if project was created successfully
   */
  async verifyProjectCreationSuccess() {
    // Define selectors for success indicators
    const successIndicatorSelectors = [
      '.alert-success',
      '.toast-success',
      'div:has-text("Project created successfully")',
      '[data-testid="project-creation-success"]'
    ];
    
    // Check if success message is visible
    const isSuccess = await this.isElementVisible(successIndicatorSelectors);
    
    if (isSuccess) {
      console.log('Project was created successfully');
    } else {
      console.log('Project creation success indicator not found');
    }
    
    return isSuccess;
  }

  /**
   * Fill the Create Project form with all required data
   * @param {Object} projectData - Project data object with all field values
   */
  async fillProjectForm(projectData) {
    if (projectData.projectName) {
      await this.fillInput(this.projectNameInputSelector, projectData.projectName);
    }
    
    if (projectData.knowledgeBase) {
      await this.selectKnowledgeBase(projectData.knowledgeBase);
    }
    
    if (projectData.groundTruthFile) {
      await this.uploadGroundTruthFile(projectData.groundTruthFile);
    }
    
    if (projectData.nShotPrompts) {
      await this.selectNShotPrompts(projectData.nShotPrompts);
    }
    
    if (projectData.shotPromptFile) {
      await this.uploadShotPromptFile(projectData.shotPromptFile);
    }
    
    if (projectData.systemPrompt) {
      await this.fillSystemPrompt(projectData.systemPrompt);
    }
    
    if (projectData.userPrompt) {
      await this.fillUserPrompt(projectData.userPrompt);
    }
    
    if (projectData.retrievalModel) {
      await this.selectRetrievalModel(projectData.retrievalModel);
    }
    
    if (projectData.knnNumber) {
      await this.setKNNNumber(projectData.knnNumber);
    }
    
    if (projectData.evaluationService) {
      await this.setEvaluationService(projectData.evaluationService);
    }
    
    if (projectData.evaluationModel) {
      await this.selectEvaluationModel(projectData.evaluationModel);
    }
    
    if (projectData.embeddingModelProvider) {
      await this.selectEvaluationEmbeddingModelProvider(projectData.embeddingModelProvider);
    }
    
    if (projectData.embeddingModel) {
      await this.setEvaluationEmbeddingModel(projectData.embeddingModel);
    }
    
    console.log('Filled all Project form fields');
  }

  /**
   * Submit the Create Project form
   */
  async submitCreateProjectForm() {
    await this.clickElement(this.createProjectSubmitButtonSelector);
    console.log('Submitted Create Project form');
  }

  /**
   * Take screenshot of Create Project modal
   * @param {string} fileName - Name for the screenshot file
   */
  async takeCreateProjectModalScreenshot(fileName) {
    await this.page.screenshot({ path: `./tests/screenshots/${fileName}.png` });
    console.log(`Took screenshot and saved as ${fileName}.png`);
  }
}

module.exports = ProjectPage;
