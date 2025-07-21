<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Copilot Instructions for Playwright Automation Project

This is a Playwright automation project using JavaScript for testing web applications.

## Project Context
- This project is focused on automating login and testing for the Flotorch QA Console
- Base URL: https://qa-console.flotorch.cloud/
- Using Playwright with JavaScript (not TypeScript)
- Test files are located in the `tests/` directory
- Screenshots are saved in `tests/screenshots/` directory

## Code Standards
- Use JavaScript (not TypeScript) for all test files
- Follow Playwright best practices for element selection and waiting
- Include proper error handling and logging
- Use descriptive test names and comments
- Take screenshots for debugging and verification
- Use multiple selector strategies for robust element finding

## Test Structure
- Use `test.describe()` for grouping related tests
- Include proper setup and teardown
- Use `page.waitForLoadState()` and `page.waitForSelector()` for reliable tests
- Implement fallback strategies for element selection
- Include console logging for debugging

## Selectors Best Practices
- Try multiple selector strategies (ID, name, type, placeholder, class)
- Use text-based selectors as fallbacks
- Implement loops to try different selectors
- Log which selectors work for future reference
