const { fromWorkspace, fromProject } = require('./tools/utils/paths.js');

module.exports = {
  rootDir: fromWorkspace(),
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{html,htmlx,svelte}', '!**/node_modules/**'],
  testMatch: [fromWorkspace('**/*.test.js')],
  moduleFileExtensions: ['js'],
  moduleDirectories: [
    fromProject('node_modules'),
    fromWorkspace('node_modules'),
    fromWorkspace(),
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': fromProject(
      'tools/jest/__mocks__/fileMock.js',
    ),
    '\\.(s[ac]?|c)ss$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.js?$': fromProject('tools/jest/babelPreprocess.js'),
    '^.+\\.(htmlx?|svelte)$': fromProject('tools/jest/svelteTransformer.js'),
  },
};
