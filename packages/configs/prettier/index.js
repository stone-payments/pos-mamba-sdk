const { lineLength } = require('../shared.js');

module.exports = {
  semi: true,
  tabWidth: 2,
  printWidth: lineLength,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  singleQuote: true,
  overrides: [
    {
      files: '*.ts',
      options: {
        parser: 'typescript',
      },
    },
  ],
};
