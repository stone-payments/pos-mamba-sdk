const chalk = require('chalk');
const { getWebpackConfigPath } = require('../utils.js');
const shell = require('../../../lib/shell.js');
const { PLATFORMS } = require('../../../consts.js');

/** Start the webpack development server */
module.exports = {
  command: 'start',
  desc: 'Start the development server',
  handler({ debug, port, platform }) {
    const webpackConfigPath = getWebpackConfigPath('app.dev');

    console.log(chalk.cyan(`Starting the development server at: http://localhost:${port}`));
    if (platform) console.log(`PLATFORM: ${chalk.yellow(platform)}`);

    const cmd = [
      'cross-env',
      /** If development flag has a numeric value */
      Number.isInteger(debug) && `DEBUG_LVL=${debug}`,
      `PLATFORM=${platform}`,
      `webpack-dev-server --env PLATFORM=${platform} --port ${port} --config "${webpackConfigPath}"`,
    ]
      .filter(Boolean)
      .join(' ');

    shell(cmd);
  },
  builder: (yargs) =>
    yargs.options({
      port: {
        description: 'Define the development web server port',
        alias: ['p'],
        default: 8080,
      },
      debug: {
        description: 'Enable debug level log.',
        alias: ['d'],
        default: false,
        choices: [false, 1, 2, 3],
      },
      platform: {
        description: 'Choose the platform to build artifact',
        alias: ['pl'],
        default: 'GENERIC',
        choices: [...PLATFORMS],
      },
    }),
};
