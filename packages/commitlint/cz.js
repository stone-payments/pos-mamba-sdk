/* eslint-disable global-require */
const path = require('path');
const fs = require('fs');
const { list, COMMIT_TYPES } = require('./types.js');

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
      // eslint-disable-next-line import/no-dynamic-require
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

module.exports = {
  disableEmoji: true,
  scopes: [
    'all',
    'project',
    'configs',
    'tests',
    'components',
    'simulator',
    'pos',
    ...((isLerna(state) && getAllPackages(state)) || []),
  ],
  questions: ['type', 'scope', 'subject', 'issues'],
  format: '{type}{scope}: {subject}',
  types: COMMIT_TYPES,
  list,
};
