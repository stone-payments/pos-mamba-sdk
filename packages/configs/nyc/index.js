const tsConfig = require('@istanbuljs/nyc-config-typescript');
const hookRunInThisContextConfig = require('@istanbuljs/nyc-config-hook-run-in-this-context');
const { testResults } = require('../playwright/consts.js');

const IS_CI = process.env.CI_TEST || process.env.CI;

const base = {
  all: true,
  'report-dir': testResults,
  'check-coverage': false,
  reporter: IS_CI ? ['cobertura', 'text-summary', 'html'] : ['text', 'html'],
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
