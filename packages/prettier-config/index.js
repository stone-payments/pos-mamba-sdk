/**
 * Copyright 2021 Stone Co.
 *
 * Licensed under Apache License - Version 2.0
 * http://www.apache.org/licenses/
 *
 */

'use strict';

const lineLength = 100;

exports.lineLength = lineLength;

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
