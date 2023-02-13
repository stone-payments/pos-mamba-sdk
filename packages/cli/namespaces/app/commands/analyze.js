const chalk = require('chalk');
const { getWebpackConfigPath } = require('../utils.js');
const shell = require('../../../lib/shell.js');
const cliArgs = require('../args.js');
const { PLATFORMS } = require('../../../consts.js');

/** Build the app for a specific environment */
module.exports = {
  command: 'analyze',
  desc: 'Analyze the app bundle',
  handler({ target, platform }) {
    const cmd = [
      'cross-env',
      'NODE_ENV=production',
      `APP_ENV=${target}`,
      `webpack --env PLATFORM=${platform} --config "${getWebpackConfigPath('app.analyzer')}"`,
    ].join(' ');

    console.log(chalk.cyan(`Analyzing bundle for '${target.toUpperCase()}'`));
    console.log(`PLATFORM: ${chalk.yellow(platform)}`);

    shell(cmd);
  },
  builder: (yargs) =>
    yargs.options({
      target: cliArgs.target,
      platform: {
        description: 'Choose the platform to analyze',
        alias: ['pl'],
        default: 'S920',
        choices: [...PLATFORMS],
      },
    }),
};
