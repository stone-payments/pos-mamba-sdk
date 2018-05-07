const { fromWorkspace, fromProject } = require('./tools/helpers/paths.js')

module.exports = {
  rootDir: fromWorkspace(),
  collectCoverageFrom: [fromWorkspace('**/*.test.js')],
  testMatch: [fromWorkspace('**/*.test.js')],
  moduleFileExtensions: ['js', 'jsx'],
  moduleDirectories: [
    fromProject('node_modules'),
    fromWorkspace('node_modules'),
    fromWorkspace('src'),
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': fromProject(
      'tools/jest/__mocks__/fileMock.js',
    ),
    '\\.(s[ac]?|c)ss$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.jsx?$': fromProject('tools/jest/babelPreprocess.js'),
  },
}
