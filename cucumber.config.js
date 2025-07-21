const common = {
  require: [
    'features/support/**/*.js',
    'features/step_definitions/**/*.js'
  ],
  format: [
    'progress-bar',
    'json:reports/cucumber-report.json',
    'html:reports/cucumber-report.html',
    'allure-cucumberjs/reporter:allure-results'
  ],
  formatOptions: {
    snippetInterface: 'async-await'
  },
  worldParameters: {
    foo: 'bar'
  }
};

module.exports = {
  default: {
    ...common,
    tags: 'not @skip',
    parallel: 1
  },
  smoke: {
    ...common,
    tags: '@smoke',
    parallel: 1
  },
  positive: {
    ...common,
    tags: '@positive',
    parallel: 1
  },
  negative: {
    ...common,
    tags: '@negative',
    parallel: 1
  },
  ui: {
    ...common,
    tags: '@ui-validation',
    parallel: 1
  }
};
