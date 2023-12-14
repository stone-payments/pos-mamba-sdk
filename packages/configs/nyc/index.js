const tsConfig = require('@istanbuljs/nyc-config-typescript');
const hookRunInThisContextConfig = require('@istanbuljs/nyc-config-hook-run-in-this-context');
const { testCoverageDir } = require('../playwright/consts.js');

const IS_CI = process.env.CI_TEST || process.env.CI;
const { NYC_CUSTOM_REPORTER } = process.env;

let reporter = IS_CI ? ['cobertura', 'text-summary', 'html'] : ['text', 'html'];
if (NYC_CUSTOM_REPORTER && Array.isArray(NYC_CUSTOM_REPORTER)) {
  reporter = NYC_CUSTOM_REPORTER;
}

const base = {
  all: true,
  'report-dir': testCoverageDir,
  'check-coverage': false,
  reporter,
  include: ['src/**/*.js', 'src/**/*.cjs', 'src/**/*.mjs', 'src/**/*.ts'],
  exclude: ['**/*.spec.js', '**/*.test.js'],
};

// Allow more refined orchestration without hook and ts config
exports.base = base;

module.exports = {
  ...tsConfig,
  ...hookRunInThisContextConfig,
  ...base,
};
