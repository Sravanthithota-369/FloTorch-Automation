/**
 * Cucumber Step Definition Tester
 * 
 * This script verifies that step definitions are correctly matched to Gherkin steps.
 * It helps debug issues with navigation between feature files and step definitions.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Get all step definition files
const stepFiles = glob.sync('features/step_definitions/**/*.js');

// Get all feature files
const featureFiles = glob.sync('features/**/*.feature');

console.log(`Found ${stepFiles.length} step definition files and ${featureFiles.length} feature files`);

// Extract step patterns from step files
const steps = [];
stepFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const stepRegex = /(Given|When|Then)\s*\(\s*['"](.+?)['"]\s*,/g;
  let match;
  
  while ((match = stepRegex.exec(content)) !== null) {
    steps.push({
      type: match[1],
      pattern: match[2],
      file: file,
      line: content.substring(0, match.index).split('\n').length
    });
  }
});

console.log(`Extracted ${steps.length} step definitions`);

// Extract steps from feature files
const featureSteps = [];
featureFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    const stepRegex = /^\s*(Given|When|Then|And|But)\s+(.+)$/;
    const match = line.match(stepRegex);
    
    if (match) {
      featureSteps.push({
        type: match[1],
        text: match[2],
        file: file,
        line: index + 1
      });
    }
  });
});

console.log(`Extracted ${featureSteps.length} steps from feature files`);

// Match feature steps to step definitions
const matchResults = [];
featureSteps.forEach(featureStep => {
  // Find matching step definition
  let found = false;
  
  steps.forEach(step => {
    // Convert Cucumber expression to regex
    let pattern = step.pattern;
    pattern = pattern.replace(/\{string\}/g, '"[^"]*"');
    pattern = pattern.replace(/\{int\}/g, '\\d+');
    pattern = pattern.replace(/\{float\}/g, '\\d+\\.\\d+');
    pattern = pattern.replace(/\{word\}/g, '[^\\s]+');
    
    const regex = new RegExp(`^${pattern}$`);
    
    if (regex.test(featureStep.text)) {
      found = true;
      matchResults.push({
        featureStep,
        stepDefinition: step,
        matched: true
      });
    }
  });
  
  if (!found) {
    matchResults.push({
      featureStep,
      matched: false
    });
  }
});

// Output summary
const matched = matchResults.filter(r => r.matched).length;
const unmatched = matchResults.filter(r => !r.matched).length;

console.log(`\nResults: ${matched} steps matched, ${unmatched} steps unmatched`);

if (unmatched > 0) {
  console.log('\nUnmatched steps:');
  matchResults.filter(r => !r.matched).forEach(result => {
    console.log(`  - "${result.featureStep.text}" in ${result.featureStep.file}:${result.featureStep.line}`);
  });
}

console.log('\nStep definition to feature file mapping ready for navigation!');
