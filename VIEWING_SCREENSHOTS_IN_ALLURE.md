# How to View Screenshots in Allure Reports

## ✅ **Issue Fixed!** Screenshots are now properly appearing in Allure reports.

## Where to Find Screenshots in Allure Report

### 1. **Open the Allure Report**
```bash
npm run allure:generate
npm run allure:open
```
The report will open at: `http://127.0.0.1:[PORT]`

### 2. **Navigate to Test Results**
- Click on **"Suites"** in the left sidebar
- Select your test feature (e.g., "Login to QA Console")
- Click on any test scenario

### 3. **View Screenshots in Test Steps**
Screenshots will appear in multiple locations:

#### **A) Step-by-Step Screenshots**
- Expand any test step (e.g., "I enter valid email address")
- Look for attachment icons 📎 next to step names
- Click on attachment names like:
  - "Before Entering Email"
  - "After Entering Email"
  - "Before Clicking Login Button" 
  - "After Clicking Login Button"

#### **B) Success/Failure Screenshots**
- Scroll to the bottom of the test details
- Look for "Attachments" section
- Click on:
  - "Success Screenshot: [Test Name]" (for passed tests)
  - "Failed Screenshot: [Test Name]" (for failed tests)

#### **C) Additional Attachments**
- "Page HTML at Failure" (for debugging failed tests)
- "URL at Failure" (current page URL when test failed)
- "Final URL" (for successful tests)

### 4. **Screenshot Features**

✅ **Before/After Action Screenshots**: Captured automatically for each major action
✅ **Full Page Screenshots**: Complete page capture including content below the fold
✅ **Named Screenshots**: Each screenshot has a descriptive name
✅ **Organized Storage**: Screenshots saved in `allure-results/screenshots/` folder
✅ **Automatic Cleanup**: Fresh screenshots generated for each test run

### 5. **Screenshot File Organization**

Screenshots are saved with descriptive names:
```
allure-results/screenshots/
├── Before_Entering_Email-[timestamp].png
├── After_Entering_Email-[timestamp].png
├── Before_Clicking_Login_Button-[timestamp].png
├── After_Clicking_Login_Button-[timestamp].png
├── success-[scenario]-[timestamp].png
└── failed-[scenario]-[timestamp].png
```

### 6. **What Was Fixed**

**Previous Issue**: Screenshots were being captured but not properly attached to Allure
**Root Cause**: Using image buffers instead of file paths for attachments
**Solution Applied**:
- Updated `BasePage.captureScreenshotForAllure()` to save screenshots as files
- Modified step definitions to read screenshot files and attach them properly
- Updated hooks to use file-based screenshot attachments
- Added helper function `attachScreenshotToAllure()` for consistent attachment handling

### 7. **Verification**

To verify screenshots are working:
1. Run any test with screenshots: `npx cucumber-js features/screenshot-demo.feature`
2. Check console output for "Screenshot attached to Allure" messages
3. Generate and open Allure report
4. Navigate to test details and look for attachment icons 📎
5. Click on screenshot attachments to view full-size images

## 🎯 **Result**: Screenshots are now fully visible and properly organized in Allure reports!
