/* eslint-disable @typescript-eslint/no-explicit-any */
import codeCoverageTask from '@cypress/code-coverage/task';
import webpackPreprocessor from '@cypress/webpack-preprocessor';
import webpackConfig from './webpack.config.test';

function setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
  process.env.TEST = JSON.stringify(true);
  on('file:preprocessor', webpackPreprocessor({ webpackOptions: webpackConfig }));
  codeCoverageTask(on, config);
  return config;
}

export default {
  reporter: 'mocha-junit-reporter',
  reporterOptions: {
    mochaFile: 'reports/tests-results.e2e.xml',
    testsuitesTitle: false,
  },
  e2e: {
    supportFile: 'e2e/support/index.ts',
    specPattern: 'e2e/**/*.cy.ts',
    baseUrl: 'http://localhost:8080',
    videoUploadOnPasses: false,
    fixturesFolder: false,
    screenshotsFolder: 'reports/screenshots',
    videosFolder: 'reports/videos',
    setupNodeEvents,
  },
} as Cypress.ConfigOptions<any>;
