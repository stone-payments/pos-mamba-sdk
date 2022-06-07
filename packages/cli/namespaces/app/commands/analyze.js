const chalk = require('chalk');
const { getWebpackConfigPath } = require('../utils.js');
const shell = require('../../../lib/shell.js');
const cliArgs = require('../args.js');

/** Build the app for a specific environment */
module.exports = {
  command: 'analyze',
  desc: 'Analyze the app bundle',
  handler({ target }) {
    const cmd = [
      'cross-env',
      'NODE_ENV=production',
      `APP_ENV=${target}`,
      `webpack --config "${getWebpackConfigPath('app.analyzer')}"`,
    ].join(' ');

    console.log(chalk.cyan(`Analyzing bundle for '${target.toUpperCase()}'`));
    shell(cmd);
  },
  builder: (yargs) =>
    yargs.options({
      target: cliArgs.target,
    }),
};
