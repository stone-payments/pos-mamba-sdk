const { writeFileSync } = require('fs');
const shell = require('shelljs');
const Case = require('case');
const inquirer = require('inquirer');
const { fromCwd, getPkg } = require('quickenv');
const chalk = require('chalk');

const { removeDiacritics } = require('../../utils.js');

const REPO = 'stone-payments/pos-mamba-app-template';

module.exports = {
  command: 'create <target>',
  desc: 'Create a new app directory',
  handler({ target, force }) {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Name',
          validate: str => !!str.length,
        },
        {
          type: 'input',
          name: 'version',
          message: 'Version',
          default: '0.0.1',
          validate: str => str.split('.').length >= 3,
        },
        {
          type: 'input',
          name: 'description',
          message: 'Description',
          validate: str => !!str.length,
        },
      ])
      .then(({ name, version, description }) => {
        console.log(chalk.blue('Downloading template...'));
        const downloadCmd = shell.exec(
          `npx degit ${REPO} ${target} ${force ? '-f' : ''}`,
          {
            silent: true,
          },
        );

        if (downloadCmd.code !== 0) {
          console.error(chalk.red(downloadCmd.stderr));
          process.exit(downloadCmd.code);
        }

        console.log(chalk.blue("Setupping 'package.json'"));
        const pkgJson = getPkg({ path: target });
        const normalizedName = Case.kebab(removeDiacritics(name));

        pkgJson.name = normalizedName;
        pkgJson.mamba.appName = name;
        pkgJson.version = version;
        pkgJson.description = description;

        const date = new Date();
        date.setSeconds(date.getSeconds(), 0);
        pkgJson.mamba.appCreationDate = date.toISOString();

        writeFileSync(
          fromCwd(target, 'package.json'),
          JSON.stringify(pkgJson, null, 2),
        );

        console.log(chalk.green('App created'));
      });
  },
  builder: yargs =>
    yargs
      .positional('target', {
        describe: 'Directory to create the app',
        type: 'string',
      })
      .option('force', {
        description: 'Overwrite target directory',
        alias: ['f'],
        default: false,
      }),
};
