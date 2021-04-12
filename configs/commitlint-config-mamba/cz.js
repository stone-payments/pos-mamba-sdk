/**
 * Custom Conventional Commits for git-cz and commitlint
 *
 * Usage with https://github.com/streamich/git-cz#custom-config and https://commitlint.js.org
 *
 * Copyright 2021 Stone Co.
 * Licensed under Apache License - Version 2.0
 * http://www.apache.org/licenses/
 *
 */

'use strict';

const { list, COMMIT_TYPES } = require('./types.js');

module.exports = {
  disableEmoji: true,
  scopes: [
    'components',
    'simulator',
    'webpack',
    'configs',
    'cypress',
    'styles',
    'core',
    'jest',
    'cli',
    'pos',
  ],
  questions: ['type', 'scope', 'subject'],
  types: COMMIT_TYPES,
  list,
};
