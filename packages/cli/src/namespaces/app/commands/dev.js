const chalk = require('chalk');
const { getWebpackConfigPath, runCmd } = require('../../../utils.js');

/** Start the webpack development server */
module.exports = {
  command: ['dev', 'start'],
  desc: 'Start the development server',
  handler({ debug, port }) {
    let cmd = '';
    cmd = 'cross-env ';

    /** If development flag has a numeric value */
    if (Number.isInteger(debug)) {
      cmd += `DEBUG_LVL=${debug} `;
    }

    cmd += `webpack-dev-server --port ${port} --config "${getWebpackConfigPath(
      'dev',
    )}"`;

    console.log(
      chalk.cyan(
        `Starting the development server at: http://localhost:${port}`,
      ),
    );
    runCmd(cmd);
  },
  builder: yargs =>
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
        choices: [false, 1, 2],
      },
    }),
};
