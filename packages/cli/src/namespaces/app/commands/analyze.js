const chalk = require('chalk');
const { cliArgs, getWebpackConfigPath, runCmd } = require('../utils.js');

/** Build the app for a specific environment */
module.exports = {
  command: 'analyze',
  desc: 'Analyze the app bundle',
  handler({ target }) {
    let cmd = '';
    cmd = 'cross-env ';
    cmd += 'NODE_ENV=production ';
    cmd += `APP_ENV=${target} `;
    cmd += `webpack --config "${getWebpackConfigPath('analyzer')}"`;

    console.log(chalk.cyan(`Analyzing bundle for '${target.toUpperCase()}'`));
    runCmd(cmd);
  },
  builder: yargs =>
    yargs.options({
      target: cliArgs.target,
    }),
};
