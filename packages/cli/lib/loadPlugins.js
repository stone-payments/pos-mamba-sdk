const { existsSync, statSync, readdirSync } = require('fs');
const { resolve } = require('path');
const importGlobal = require('import-global');
const globalDirs = require('global-dirs');

const isNotFoundError = (err) => err.code === 'MODULE_NOT_FOUND';

function loadCommand(moduleName) {
  let plugin;
  try {
    plugin = require(moduleName); // eslint-disable-line
  } catch (err) {
    if (!isNotFoundError(err)) {
      throw err;
    }
    plugin = importGlobal.silent(moduleName);
  }
  return plugin;
}

const getPackagesFrom = (path, includedStr) => {
  if (existsSync(path)) {
    return readdirSync(path).filter((f) => {
      const fullPath = resolve(path, f);
      return statSync(fullPath).isDirectory() && fullPath.includes(includedStr);
    });
  }
  return [];
};

const pkgListPaths = [
  globalDirs.npm.packages,
  globalDirs.npm.packages !== globalDirs.yarn.packages && globalDirs.yarn.packages,
  resolve(process.cwd(), 'node_modules'),
].filter(Boolean);

const externalPlugins = pkgListPaths.reduce((acc, pkgListPath) => {
  const orgPluginPath = resolve(pkgListPath, '@mamba');
  return [
    ...acc,
    ...getPackagesFrom(pkgListPath, 'mamba-cli-plugin-'),
    ...getPackagesFrom(orgPluginPath, 'cli-plugin-').map((pkg) => `@mamba/${pkg}`),
  ];
}, []);

module.exports = externalPlugins.reduce((acc, moduleName) => {
  const pluginModule = loadCommand(moduleName);
  if (Array.isArray(pluginModule)) {
    acc.push(...pluginModule);
  } else {
    acc.push(pluginModule);
  }
  return acc;
}, []);
