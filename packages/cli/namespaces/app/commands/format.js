const chalk = require('chalk');
const cliArgs = require('../args.js');
const shell = require('../../../lib/shell.js');

/** Build the app for a specific environment */
module.exports = {
  command: 'format',
  desc: 'Format the app source with eslint and stylelint',
  handler({ type }) {
    const cmds = [];

    if (!type || type === 'css') {
      cmds.push(`stylelint --fix "src/**/*.{html,svelte,css,pcss}"`);
    }

    if (!type || type === 'js') {
      cmds.push(`prettier --write *.js "{src,test,webpack}/**/*.js"`);
      cmds.push(`eslint --fix *.js "{src,test,webpack}/**/*.{js,html,svelte}"`);
    }

    shell(cmds);

    console.log(chalk.green('App format done'));
  },
  builder: (yargs) =>
    yargs.options({
      type: cliArgs.lintType,
    }),
};
