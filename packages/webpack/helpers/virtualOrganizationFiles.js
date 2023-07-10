const { existsSync } = require('fs');
const { join } = require('path');
const { fromCwd } = require('quickenv');
const { readFileSync } = require('fs');
const chalk = require('chalk');

const virtualPublicPath = '/VIRTUAL-POS';
const extenralModuleOrgName = '@mamba-pkg/module-organization';
const extenralModuleOrgFolder = fromCwd('node_modules', extenralModuleOrgName);

const existsExtenralModuleOrgFolder = existsSync(extenralModuleOrgFolder);
let exportModule = {};

let moduleOrgConfig;

if (!existsExtenralModuleOrgFolder) {
  exportModule = {
    [`${extenralModuleOrgName}`]: 'module.exports = { __virtual: true };',
  };
} else {
  try {
    moduleOrgConfig = JSON.parse(
      readFileSync(join(extenralModuleOrgFolder, 'config.json'), {
        encoding: 'utf-8',
      }),
    );
  } catch (error) {
    console.log(
      chalk.yellow(
        `[dev server] Loading of ${extenralModuleOrgName} configuration was not possible.\n`,
      ),
      error.message,
    );
  }
}

module.exports = {
  existsExtenralModuleOrgFolder,
  extenralModuleOrgName,
  exportModule,
  moduleOrgConfig,
  extenralModuleOrgFolder,
  virtualPublicPath,
};
