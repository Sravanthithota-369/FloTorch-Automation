/**
 * Utility functions for handling file uploads in Playwright tests
 * This utility helps upload files from the testdata directory
 * with support for multiple upload strategies
 */

const path = require('path');
const fs = require('fs');

/**
 * Get the absolute path of a file in the testdata directory
 * @param {string} fileName - Name of the file in the testdata directory
 * @returns {string} Absolute path to the file
 */
function getTestDataFilePath(fileName) {
  const rootDir = process.cwd();
  const filePath = path.join(rootDir, 'testdata', fileName);
  
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    return filePath;
  }
  
  console.warn(`Warning: File ${fileName} not found in testdata folder`);
  return filePath; // Return the path even if not found, as the error will be handled by the upload function
}

/**
 * List all available files in the testdata directory
 * @returns {Array<string>} List of files in the testdata folder
 */
function listTestDataFiles() {
  const rootDir = process.cwd();
  
  try {
    if (fs.existsSync(path.join(rootDir, 'testdata'))) {
      return fs.readdirSync(path.join(rootDir, 'testdata'));
    }
  } catch (error) {
    console.warn(`Error reading testdata directory: ${error.message}`);
  }
  
  return [];
}

/**
 * Upload a file using Playwright's setInputFiles method with robust fallback options
 * @param {Page} page - Playwright page object
 * @param {string|Array<string>} selectors - File input selector or array of selectors to try
 * @param {string} fileName - Name of file in the testdata directory or full file path
 * @param {Object} options - Additional options for the upload
 * @param {boolean} options.useTestDataFolder - Whether to look in test-data folder instead of testdata
 * @param {boolean} options.useChooseFileButton - Whether to click a Choose File button before upload
 * @param {string|Array<string>} options.chooseFileButtonSelector - Selector(s) for the Choose File button
 * @returns {Promise<boolean>} True if upload was successful
 */
async function uploadFile(page, selectors, fileName, options = {}) {
  // Default options
  const defaultOptions = {
    useChooseFileButton: false,
    chooseFileButtonSelector: 'button:has-text("Choose File")'
  };
  
  const opts = { ...defaultOptions, ...options };
  
  // Determine if this is a file name or a full path
  const isFullPath = fileName.includes('/') || fileName.includes('\\');
  const filePath = isFullPath ? fileName : getTestDataFilePath(fileName);
  
  // Convert selector to array if it's a string
  const selectorArray = Array.isArray(selectors) ? selectors : [selectors];
  
  // Log the upload attempt
  console.log(`Attempting to upload file: ${filePath}`);
  
  // Strategy 1: Try direct file input without clicking Choose File button
  if (!opts.useChooseFileButton) {
    for (const selector of selectorArray) {
      try {
        // Check if the file input is visible
        const isVisible = await page.isVisible(selector, { timeout: 1000 }).catch(() => false);
        
        if (isVisible) {
          // If the input is visible, use direct setInputFiles
          await page.setInputFiles(selector, filePath);
          console.log(`Directly uploaded file to visible input: ${selector}`);
          return true;
        } else {
          // Try to find the input even if it's not visible
          const inputExists = await page.$(selector).then(handle => !!handle).catch(() => false);
          
          if (inputExists) {
            // If input exists but isn't visible, use setInputFiles with force option
            await page.setInputFiles(selector, filePath, { force: true });
            console.log(`Uploaded file to hidden input: ${selector}`);
            return true;
          }
        }
      } catch (error) {
        console.warn(`Warning: Failed to upload with selector ${selector}: ${error.message}`);
      }
    }
  }
  
  // Strategy 2: Use the Choose File button and file dialog
  if (opts.useChooseFileButton || opts.forceFileChooser) {
    const buttonSelectors = Array.isArray(opts.chooseFileButtonSelector) ? 
      opts.chooseFileButtonSelector : [opts.chooseFileButtonSelector];
    
    for (const buttonSelector of buttonSelectors) {
      try {
        // Check if the button is visible
        const isButtonVisible = await page.isVisible(buttonSelector, { timeout: 1000 }).catch(() => false);
        
        if (!isButtonVisible) {
          console.warn(`Warning: Choose File button not visible: ${buttonSelector}`);
          continue;
        }
        
        // Set up file chooser before clicking button
        const [fileChooser] = await Promise.all([
          page.waitForEvent('filechooser', { timeout: 5000 }),
          page.click(buttonSelector)
        ]);
        
        await fileChooser.setFiles(filePath);
        console.log(`Uploaded file via file chooser dialog triggered by button: ${buttonSelector}`);
        return true;
      } catch (error) {
        console.warn(`Warning: Failed to upload with button ${buttonSelector}: ${error.message}`);
      }
    }
  }
  
  // Strategy 3: Fallback to try all available input[type="file"] elements
  try {
    const allFileInputs = await page.$$('input[type="file"]');
    if (allFileInputs.length > 0) {
      console.log(`Found ${allFileInputs.length} file input elements, trying the first one as fallback`);
      await allFileInputs[0].setInputFiles(filePath);
      console.log('Uploaded file using fallback method');
      return true;
    }
  } catch (error) {
    console.warn(`Warning: Fallback upload method failed: ${error.message}`);
  }
  
  throw new Error(`Could not upload file ${fileName} using any method`);
}

/**
 * Upload Ground Truth File using the utility
 * @param {Page} page - Playwright page object
 * @param {string} fileName - Name of file in testdata directory or full path
 * @returns {Promise<boolean>} True if upload was successful
 */
async function uploadGroundTruthFile(page, fileName) {
  const selectors = [
    'input[type="file"][name="groundTruthFile"]',
    '[data-testid="ground-truth-file-input"]',
    'input[type="file"]:near(:text("Ground Truth File"))'
  ];
  
  // Use POM's choose file button selectors
  const buttonSelectors = [
    'button:has-text("Choose File")',
    '[data-testid="choose-file-button"]'
  ];
  
  // Upload by clicking the Choose File button to trigger file chooser and input files
  return uploadFile(page, selectors, fileName, {
    useChooseFileButton: true,
    chooseFileButtonSelector: buttonSelectors
  });
}

/**
 * Upload Shot Prompt File using the utility
 * @param {Page} page - Playwright page object
 * @param {string} fileName - Name of file in testdata directory or full path
 * @returns {Promise<boolean>} True if upload was successful
 */
async function uploadShotPromptFile(page, fileName) {
  const selectors = [
    'input[type="file"][name="shotPromptFile"]',
    '[data-testid="shot-prompt-file-input"]',
    'input[type="file"]:near(:text("Shot Prompt File"))'
  ];
  
  const buttonSelectors = [
    // Simple fallback for any 'Choose File' button
    'button:has-text("Choose File")',
    'button:has-text("Choose File"):near(:text("Shot Prompt File"))',
    '[data-testid="shot-prompt-file-button"]',
    '.file-upload-button:near(:text("Shot Prompt"))'
  ];
  
  return uploadFile(page, selectors, fileName, {
    useChooseFileButton: true,
    chooseFileButtonSelector: buttonSelectors
  });
}

/**
 * Generic function to upload any file in the application
 * @param {Page} page - Playwright page object
 * @param {string} fileName - Name of file in testdata directory or full path
 * @param {Object} options - Upload options
 * @returns {Promise<boolean>} True if upload was successful
 */
async function uploadAnyFile(page, fileName, options = {}) {
  // Generic selectors that might work across different file upload areas
  const genericSelectors = [
    'input[type="file"]',
    '[type="file"]',
    'input[accept]'
  ];
  
  const genericButtonSelectors = [
    'button:has-text("Choose File")',
    'button:has-text("Upload")',
    'button:has-text("Browse")',
    '.file-upload-button'
  ];
  
  return uploadFile(page, genericSelectors, fileName, {
    useChooseFileButton: true,
    chooseFileButtonSelector: genericButtonSelectors,
    ...options
  });
}

module.exports = {
  getTestDataFilePath,
  listTestDataFiles,
  uploadFile,
  uploadGroundTruthFile,
  uploadShotPromptFile,
  uploadAnyFile
};
