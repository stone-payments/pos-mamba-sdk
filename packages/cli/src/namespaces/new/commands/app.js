const { writeFileSync } = require('fs');
const shell = require('shelljs');
const Case = require('case');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { fromCwd, getPkg } = require('quickenv');

const { removeDiacritics, hashString } = require('../../../utils.js');

const REPO = 'stone-payments/pos-mamba-app-template';

/** Create a new mamba app directory */
module.exports = {
  command: 'app <targetDir>',
  desc: 'Create a new app directory',
  handler({ targetDir, force }) {
    targetDir = fromCwd(targetDir);
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

        /** Install degit if it's not installed yet */
        // if (!shell.which('degit')) {
        //   shell.exec('npm i -g degit');
        // }

        const downloadCmd = shell.exec(
          `npx degit ${REPO} "${targetDir}" ${force ? '-f' : ''}`,
          {
            silent: true,
          },
        );

        if (downloadCmd.code !== 0) {
          console.error(chalk.red(downloadCmd.stderr));
          process.exit(downloadCmd.code);
        }

        console.log(chalk.blue("Setupping 'package.json'"));

        const pkgJson = getPkg({ path: targetDir });
        const normalizedName = Case.kebab(removeDiacritics(name));
        const date = new Date();

        pkgJson.name = normalizedName;
        pkgJson.version = version;
        pkgJson.description = description;

        pkgJson.mamba.appCreationDate = date.toISOString();
        pkgJson.mamba.id = parseInt(
          hashString(normalizedName + date.toISOString() + description)
            .toString()
            .slice(0, 5),
          10,
        );
        pkgJson.mamba.appName = name;

        writeFileSync(
          fromCwd(targetDir, 'package.json'),
          JSON.stringify(pkgJson, null, 2),
        );

        console.log(chalk.blue('Installing dependencies'));
        shell.cd(targetDir);
        shell.exec('npm i');

        console.log(chalk.green(`App created at '${targetDir}'`));
      });
  },
  builder: yargs =>
    yargs
      .positional('targetDir', {
        describe: 'Directory to create the app',
        type: 'string',
      })
      .option('force', {
        description: 'Overwrite target directory',
        alias: ['f'],
        default: false,
      }),
};
