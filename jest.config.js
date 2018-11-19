const { readdirSync, statSync } = require('fs');
const { getPkg } = require('quickenv');
const { resolve } = require('path');
const { fromWorkspace, fromProject } = require('./tools/utils/paths.js');

const getDirs = p =>
  readdirSync(p).filter(f => statSync(resolve(p, f)).isDirectory());

const componentsPath = fromProject('packages', 'components');

module.exports = {
  rootDir: fromWorkspace(),
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{html,htmlx,svelte}',
    '!**/node_modules/**',
    '!packages/pos/**',
    '!packages/**/example/**',
  ],
  coverageThreshold: {
    '**/*.html': {
      branches: 0,
    },
  },
  testMatch: [fromWorkspace('**/*.test.js')],
  setupFiles: [
    fromProject('tools/jest/setup/simulator.js'),
    fromProject('tools/jest/setup/app.js'),
    'jest-canvas-mock',
  ],
  moduleFileExtensions: ['js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': fromProject(
      'tools/jest/__mocks__/fileMock.js',
    ),
    '\\.(s[ac]?|c)ss$': 'identity-obj-proxy',
    /** act as a resolver for the "svelte" field of a component package.json */
    ...getDirs(componentsPath).reduce((acc, dirName) => {
      const pkg = getPkg({
        path: resolve(componentsPath, dirName),
        traverse: false,
      });

      const mainFile = pkg.svelte || pkg.main || `${dirName}.html`;

      acc[`@mamba/${dirName.toLocaleLowerCase()}$`] = resolve(
        componentsPath,
        dirName,
        mainFile,
      );

      return acc;
    }, {}),
  },
  transform: {
    '^.+\\.js?$': fromProject('tools/jest/babelPreprocess.js'),
    '^.+\\.(htmlx?|svelte)$': fromProject('tools/jest/svelteTransformer.js'),
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
