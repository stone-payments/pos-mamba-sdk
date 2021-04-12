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

const { list } = require('./types.js');

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', list],
  },
};
