const path = require('path');
const fs = require('fs');
const types = require('./types.js');

const isLerna = (state) => fs.existsSync(path.join(state.root, 'lerna.json'));

const isDir = (root) => (name) => {
  const filepath = path.join(root, name);

  try {
    const stats = fs.statSync(filepath);

    return stats.isDirectory();
  } catch (error) {
    return false;
  }
};

const removeLastDirectoryPartOf = (url) => url.substring(0, url.lastIndexOf('/'));

const getPackageDirectories = (state) => {
  const pkgFilename = path.join(state.root, 'package.json');

  if (fs.existsSync(pkgFilename)) {
    try {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const workspacesConfig = require(`${pkgFilename}`).workspaces;
      const workspacePackages = Array.isArray(workspacesConfig)
        ? workspacesConfig
        : workspacesConfig.packages;

      if (workspacePackages && workspacePackages.length) {
        return workspacePackages
          .filter((workspacePackage) => workspacePackage.endsWith('*'))
          .map(
            (workspacePackage) => removeLastDirectoryPartOf(String(workspacePackage)),

            // else {
            // TODO: support paths that do not end with '*', in that case the package it self is the directory so we don't need to look at inner directories
            //   return workspacePackage
            // }
          );

        // Remove the /* on the tail
      }
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }

  return 'packages';
};

const getAllPackages = (state) => {
  try {
    const dirs = getPackageDirectories(state).map((dir) => path.join(state.root, dir));

    return dirs.flatMap((dir) => fs.readdirSync(dir).filter(isDir(dir)));
  } catch (error) {
    return [];
  }
};

const state = {
  root: process.cwd(),
};

const isLernaState = isLerna(state);

/** @type {import('cz-git').UserConfig} */
module.exports = {
  rules: {
    'type-enum': [2, 'always', types.map((type) => type.value)],
  },
  prompt: {
    // alias: { fd: 'docs: fix typos' },
    messages: {
      type: "Select the type of change that you're committing:",
      scope: 'Denote the SCOPE of this change (optional):',
      customScope: 'Denote the SCOPE of this change:',
      subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
      body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
      breaking: 'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
      footerPrefixSelect: 'Select the ISSUES type of changeList by this change (optional):',
      customFooterPrefix: 'Input ISSUES prefix:',
      footer: 'List any ISSUES by this change. E.g.: #31, #34:\n',
    },
    types,
    useEmoji: true,
    emojiAlign: 'center',
    useAI: false,
    aiNumber: 1,

    scopes: [
      'project',
      'configs',
      'tests',
      'components',
      'simulator',
      'pos',
      ...((isLernaState && getAllPackages(state)) || []),
    ],

    allowCustomScopes: true,
    allowEmptyScopes: true,
    breaklineChar: '>',
    maxSubjectLength: 100,
  },
};
