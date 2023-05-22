const { lineLength } = require('./shared.cjs');

module.exports = {
  semi: true,
  tabWidth: 2,
  printWidth: lineLength,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  singleQuote: true,
  plugins: ['prettier-plugin-svelte'],
  pluginSearchDirs: false,
  overrides: [
    {
      files: '*.ts',
      options: {
        parser: 'typescript',
      },
    },
  ],
};
