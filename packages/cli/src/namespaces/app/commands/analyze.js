const chalk = require('chalk');
const { getWebpackConfigPath, shell } = require('../../../utils.js');
const cliArgs = require('../args.js');

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
    shell(cmd);
  },
  builder: yargs =>
    yargs.options({
      target: cliArgs.target,
    }),
};
