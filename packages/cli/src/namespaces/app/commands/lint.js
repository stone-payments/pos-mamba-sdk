const chalk = require('chalk');
const { runCmd } = require('../../../utils.js');
const cliArgs = require('../args.js');

/** Build the app for a specific environment */
module.exports = {
  command: 'lint',
  desc: 'Lint the app source with eslint and stylelint',
  handler({ type }) {
    let cmd = '';

    if (!type || type === 'css') {
      cmd += `stylelint "src/**/*.{html,svelte,css,pcss}";`;
    }

    if (!type || type === 'js') {
      cmd += `eslint "*.js" "{src,test,webpack}/**/*.{js,html,svelte}";`;
    }

    runCmd(cmd);

    console.log(chalk.green('App lint done'));
  },
  builder: yargs =>
    yargs.options({
      type: cliArgs.lintType,
    }),
};
