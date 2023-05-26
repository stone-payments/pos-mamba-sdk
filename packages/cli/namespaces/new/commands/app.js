const { writeFileSync } = require('fs');
const Case = require('case');
const inquirer = require('inquirer');
const pico = require('picocolors');
const { fromWorkingDir, getPackage } = require('@mamba/utils');

const { removeDiacritics, hashString } = require('../utils.js');
const shell = require('../../../lib/shell.js');

const REPO = 'stone-payments/pos-mamba-app-template';

/** Create a new mamba app directory */
module.exports = {
  command: 'app <targetDir>',
  desc: 'Create a new app directory',
  handler({ targetDir, force }) {
    targetDir = fromWorkingDir(targetDir);
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Name',
          validate: (str) => !!str.length,
        },
        {
          type: 'input',
          name: 'version',
          message: 'Version',
          default: '0.0.1',
          validate: (str) => str.split('.').length >= 3,
        },
        {
          type: 'input',
          name: 'description',
          message: 'Description',
          validate: (str) => !!str.length,
        },
      ])
      .then(({ name, version, description }) => {
        console.log(pico.cyan('Downloading template...'));

        shell(`npx degit ${REPO} "${targetDir}" ${force ? '-f' : ''}`);

        console.log(pico.cyan("Setupping 'package.json'"));

        const pkgJson = getPackage({ path: targetDir });
        const normalizedName = Case.kebab(removeDiacritics(name));
        const date = new Date();

        date.setHours(
          date.getHours() - date.getTimezoneOffset() / 60,
          date.getMinutes(),
          date.getSeconds(),
          0,
        );

        const isoDate = date.toISOString();
        const formattedDate = isoDate.slice(0, isoDate.length - 5);

        pkgJson.name = normalizedName;
        pkgJson.version = version;
        pkgJson.description = description;

        pkgJson.mamba.appCreationDate = formattedDate;
        pkgJson.mamba.id = parseInt(
          hashString(normalizedName + formattedDate + description)
            .toString()
            .slice(0, 5),
          10,
        );
        pkgJson.mamba.appName = name;

        delete pkgJson.rootDir;

        writeFileSync(fromWorkingDir(targetDir, 'package.json'), JSON.stringify(pkgJson, null, 2));

        console.log(pico.cyan('Installing dependencies'));
        shell([`cd ${targetDir}`, `npm i`]);

        console.log(pico.green(`App created at '${targetDir}'`));
      });
  },
  builder: (yargs) =>
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
