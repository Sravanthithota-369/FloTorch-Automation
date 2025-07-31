module.exports = {
    default: {
        require: [
            'features/support/**/*.js',
            'features/step_definitions/**/*.js',
            'features/step_definitions/*.js'
        ],
        format: [
            'pretty',
            '@cucumber/pretty-formatter',
            ['html', 'reports/cucumber-report.html']
        ],
       // publishQuiet: true,
        formatOptions: {
            snippetInterface: 'async-await'
        }
    }
};
