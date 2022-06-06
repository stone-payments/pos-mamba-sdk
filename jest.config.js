const { resolve } = require('path');
const getSvelteModuleMaps = require('./packages/configs/jest/getSvelteModuleMaps.js');

module.exports = {
  rootDir: process.cwd(),
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{html,htmlx,svelte}',
    'packages/utils/**/*.js',
    '!**/node_modules/**',
    '!tools/**',
    '!packages/pos/**',
    '!packages/**/example/**',
  ],
  coverageThreshold: {
    '**/*.html': {
      branches: 0,
    },
  },
  testMatch: ['**/*.test.js'],
  setupFiles: [
    '<rootDir>/tools/jest/setup/simulator.js',
    '<rootDir>/tools/jest/setup/globals.js',
    '@mamba/configs/jest/globals.js',
    'jest-canvas-mock',
  ],
  moduleFileExtensions: ['js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg|ttf)$': '<rootDir>/tools/jest/mocks/fileMock.js',
    /** act as a resolver for the "svelte" field of a component package.json */
    ...getSvelteModuleMaps(resolve(__dirname, 'packages', 'components')),
  },
  transformIgnorePatterns: ['node_modules/(?!(@mamba)|(.+\\.html)|(svelte.+\\.js))'],
  transform: {
    '^.+\\.js$': '<rootDir>/tools/jest/babelPreprocess.js',
    '^.+\\.(htmlx?|svelte)$': '<rootDir>/tools/jest/svelteTransformer.js',
  },
  globals: {
    __NODE_ENV__: 'test',
    __APP_ENV__: 'browser',
    __PROD__: false,
    __TEST__: true,
    __DEV__: true,
    __DEBUG_LVL__: null,
    __POS__: false,
    __SIMULATOR__: true,
    __BROWSER__: true,
  },
};
