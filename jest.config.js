const { fromWorkspace } = require('./tools/helpers/utils.js')

module.exports = {
  collectCoverageFrom: [fromWorkspace('__tests__/**/*.js')],
  moduleFileExtensions: ['js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': fromWorkspace(
      '__tests__',
      '__mocks__',
      'fileMock.js',
    ),
    '\\.(s[ac]?|c)ss$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  testMatch: [fromWorkspace('__tests__/**/*.js')],
}
