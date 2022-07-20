const chalk = require('chalk');
const shell = require('../../../lib/shell.js');
const cliArgs = require('../args.js');

/** Build the app for a specific environment */
module.exports = {
  command: 'lint',
  desc: 'Lint the app source with eslint and stylelint',
  handler({ type }) {
    const cmds = [];

    if (!type || type === 'css') {
      cmds.push(`stylelint "src/**/*.{html,svelte,css,pcss}"`);
    }

    if (!type || type === 'js') {
      cmds.push(`eslint "*.js" "{src,test,webpack}/**/*.{js,html,svelte}"`);
    }

    shell(cmds);

    console.log(chalk.green('App lint done'));
  },
  builder: (yargs) =>
    yargs.options({
      type: cliArgs.lintType,
    }),
};
