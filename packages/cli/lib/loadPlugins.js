const { existsSync, statSync, readdirSync } = require('fs');
const { resolve } = require('path');
const importGlobal = require('import-global');
const globalDirs = require('global-dirs');

const isNotFoundError = err => err.code === 'MODULE_NOT_FOUND';

function loadCommand(moduleName) {
  try {
    return require(moduleName); // eslint-disable-line
  } catch (err) {
    if (isNotFoundError(err)) {
      return importGlobal.silent(moduleName);
    }
    throw err;
  }
}

const getPackagesFrom = (path, cond) => {
  if (existsSync(path)) {
    return readdirSync(path).filter(f => {
      const fullPath = resolve(path, f);
      return statSync(fullPath).isDirectory() && cond(fullPath);
    });
  }
  return [];
};

const pkgListPaths = [
  globalDirs.npm.packages,
  globalDirs.npm.packages !== globalDirs.yarn.packages &&
    globalDirs.yarn.packages,
  resolve(process.cwd(), 'node_modules'),
].filter(Boolean);

const externalPlugins = pkgListPaths.reduce((acc, pkgListPath) => {
  const orgPluginPath = resolve(pkgListPath, '@mamba');
  return [
    ...acc,
    ...getPackagesFrom(pkgListPath, path => path.includes('mamba-cli-plugin-')),
    ...getPackagesFrom(orgPluginPath, path => path.includes('cli-plugin-')).map(
      pkg => `@mamba/${pkg}`,
    ),
  ];
}, []);

module.exports = externalPlugins.map(loadCommand).filter(Boolean);
