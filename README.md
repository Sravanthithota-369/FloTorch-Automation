# Playwright Automation with Cucumber BDD, Page Object Model & Allure Reporting

This project contains Playwright automation scripts using Cucumber BDD framework, Page Object Model (POM) design pattern, and Allure reporting for comprehensive test documentation and analysis of the Flotorch QA Console.

## 🏗️ Project Structure

```
├── features/                          # Cucumber features and step definitions
│   ├── login.feature                 # BDD feature file for login scenarios
│   ├── step_definitions/             # Step definition files
│   │   └── login_steps.js           # Login step implementations with Allure annotations
│   └── support/                     # Cucumber support files
│       ├── hooks.js                 # Before/After hooks with Allure integration
│       └── world.js                 # Custom world with test data and utilities
├── pages/                           # Page Object Model classes
│   ├── BasePage.js                  # Base page with common methods
│   ├── LoginPage.js                 # Login page object
│   └── DashboardPage.js            # Dashboard page object
├── allure-results/                  # Allure test results and artifacts
│   ├── screenshots/                 # Test screenshots for Allure
│   ├── videos/                      # Test videos for Allure
│   ├── environment.properties       # Test environment configuration
│   └── categories.json             # Error categorization for Allure
├── allure-report/                   # Generated Allure HTML reports
├── reports/                         # Other test reports
│   ├── cucumber-report.json         # Cucumber JSON report
│   └── cucumber-html-report.html    # Cucumber HTML report
├── utils/                           # Utility files
│   ├── generate-report.js          # Report generation utility
│   └── allure-helper.js            # Allure utility functions
├── tests/                           # Original Playwright tests
├── cucumber.config.js               # Cucumber configuration with Allure
├── playwright.config.js             # Playwright configuration with Allure
└── package.json                     # Dependencies and scripts
```

## 🚀 Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

## 🎯 Running Tests with Allure Reporting

### Quick Start - Full Test Suite with Allure Report:
```bash
npm run test:allure
```
This command will:
1. Run all Cucumber tests
2. Generate Allure report
3. Automatically open the report in your browser

### Individual Commands:

#### Cucumber BDD Tests:
```bash
# Run all Cucumber tests
npm run cucumber:all

# Run specific test suites
npm run cucumber:smoke      # Critical functionality
npm run cucumber:positive   # Happy path scenarios
npm run cucumber:negative   # Error handling tests
npm run cucumber:ui         # UI validation tests
```

#### Playwright Tests with Allure:
```bash
# Run Playwright tests with Allure reporting
npm run playwright:allure
```

#### Allure Report Commands:
```bash
# Generate Allure report from results
npm run allure:generate

# Open existing Allure report
npm run allure:open

# Generate and serve report (auto-refresh)
npm run allure:serve

# Clean Allure directories
npm run clean:allure
```

## 📊 Allure Reports Features

### 🎨 Beautiful Visual Reports
Allure generates stunning, interactive HTML reports with:

- **📈 Test Execution Overview**: Pass/fail statistics, execution time, trends
- **🔍 Detailed Test Steps**: Step-by-step execution with timestamps
- **📸 Screenshots**: Automatic capture on failures and success
- **📹 Video Recordings**: Full test execution videos
- **🏷️ Test Categorization**: Organized by features, severity, and tags
- **📋 Error Analysis**: Categorized failures with stack traces
- **🌍 Environment Info**: Test environment and configuration details
- **📊 Historical Trends**: Test execution trends over time

### 📈 Report Sections

1. **Overview Dashboard**
   - Total tests executed
   - Pass/fail ratio
   - Execution duration
   - Environment details

2. **Suites**
   - Test organized by feature files
   - Step-by-step execution details
   - Attachments (screenshots, videos, logs)

3. **Categories**
   - Auto-categorized failures:
     - Login Failures
     - Page Load Issues
     - Element Not Found
     - Browser Issues
     - Assertion Failures

4. **Timeline**
   - Chronological test execution
   - Parallel execution visualization
   - Resource usage over time

5. **Behaviors**
   - BDD features and scenarios
   - User story mapping
   - Acceptance criteria tracking

## 🧪 Enhanced Test Scenarios with Allure

All test scenarios include rich Allure annotations:

### ✅ **Positive Tests** (`@positive`)
- **Valid Login**: Complete authentication flow with success verification
- **Dashboard Access**: Post-login page validation
- **End-to-End Flow**: Full user journey with logout

### ❌ **Negative Tests** (`@negative`)
- **Invalid Credentials**: Error handling validation
- **Empty Fields**: Form validation testing
- **Security Testing**: Authentication bypass attempts

### 🔍 **UI Validation** (`@ui-validation`)
- **Element Presence**: All form elements verification
- **Accessibility**: Form functionality testing
- **Responsive Design**: Cross-browser compatibility

## � Allure Attachments

Every test automatically captures:

### 📸 **Screenshots**
- Success screenshots for passed tests
- Failure screenshots with full page capture
- Step-by-step visual evidence

### 📹 **Videos**
- Complete test execution recordings
- Browser interaction playback
- Debugging and analysis videos

### � **Logs & Data**
- Step descriptions and actions
- Current page URLs
- HTML page content on failures
- Test data and credentials used
- Error messages and stack traces

## 🛠️ Configuration

### Environment Configuration
Located in `allure-results/environment.properties`:
```properties
Environment=QA
Browser=Chrome
Platform=Windows
Base.URL=https://qa-console.flotorch.cloud/
Test.Framework=Cucumber with Playwright
Report.Framework=Allure
Execution.Type=Local
Headless.Mode=false
```

### Test Data Configuration
Located in `features/support/world.js`:
```javascript
validCredentials: {
  email: 'sravanthi.thota+1992@fissionlabs.com',
  password: 'Havisha@119'
}
```

### Error Categorization
Automatic failure categorization in `allure-results/categories.json`:
- Login Failures
- Page Load Issues  
- Element Not Found
- Browser Issues
- Assertion Failures

## 🏷️ Test Tags for Targeted Execution

```bash
# Run by severity
npx cucumber-js --tags "@smoke"        # Critical tests
npx cucumber-js --tags "@positive"     # Happy path
npx cucumber-js --tags "@negative"     # Error cases

# Run by feature
npx cucumber-js --tags "@login"        # Login-related tests
npx cucumber-js --tags "@ui-validation" # UI tests

# Complex tag expressions
npx cucumber-js --tags "@login and @positive"     # Positive login tests
npx cucumber-js --tags "@smoke or @ui-validation" # Smoke + UI tests
npx cucumber-js --tags "not @negative"            # Skip negative tests
```

## 🚀 CI/CD Integration

### Jenkins/Azure DevOps
```bash
# Run tests and generate report
npm run cucumber:all
npm run allure:generate

# Publish Allure results
allure-commandline publish allure-results
```

### GitHub Actions
```yaml
- name: Run Tests
  run: npm run cucumber:all
  
- name: Generate Allure Report
  run: npm run allure:generate
  
- name: Publish Allure Report
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./allure-report
```

## � Best Practices Implemented

### 🏗️ **Architecture**
- **Page Object Model**: Clean separation of test logic and UI interactions
- **BDD Approach**: Business-readable Gherkin scenarios
- **Custom World**: Centralized test data and utilities
- **Modular Design**: Reusable components and helpers

### 🔍 **Reliability**
- **Robust Selectors**: Multiple fallback strategies for element finding
- **Smart Waits**: Dynamic waiting for elements and page states
- **Error Handling**: Comprehensive error catching and recovery
- **Resource Management**: Proper browser context lifecycle

### 📊 **Reporting**
- **Rich Attachments**: Screenshots, videos, logs, HTML content
- **Error Categorization**: Automatic failure classification
- **Historical Tracking**: Execution trends and patterns
- **Environment Tracking**: Complete test environment documentation

### 🚀 **Performance**
- **Isolated Contexts**: Each test runs in separate browser context
- **Parallel Ready**: Configurable parallel execution
- **Resource Optimization**: Efficient browser and memory management

## 🎉 Getting Started

### 1. **Quick Smoke Test with Allure:**
```bash
npm run cucumber:smoke
npm run allure:generate
npm run allure:open
```

### 2. **Full Test Suite with Auto-Report:**
```bash
npm run test:allure
```

### 3. **Development Mode (Watch):**
```bash
npm run cucumber:ui
npm run allure:serve  # Auto-refreshing report
```

### 4. **Clean Start:**
```bash
npm run clean:allure
npm run test:allure
```

## 📊 Sample Allure Report Features

After running tests, your Allure report will include:

- **📊 Executive Dashboard**: High-level test metrics and trends
- **🔍 Test Details**: Step-by-step execution with rich attachments  
- **🏷️ Feature Mapping**: BDD scenarios linked to business requirements
- **📈 Trend Analysis**: Historical test execution patterns
- **🚨 Failure Analysis**: Categorized errors with debugging information
- **🌍 Environment Tracking**: Complete test configuration documentation
- **📱 Screenshots & Videos**: Visual evidence of test execution
- **📄 Logs & Traces**: Detailed execution logs and error stack traces

The framework is production-ready with enterprise-grade reporting, comprehensive error handling, and detailed test documentation! 🎉
