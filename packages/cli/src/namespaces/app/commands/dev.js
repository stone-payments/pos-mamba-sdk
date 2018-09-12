const chalk = require('chalk');
const { getWebpackConfigPath, runCmd } = require('../utils.js');

/** Start the webpack development server */
module.exports = {
  command: ['dev', 'start'],
  desc: 'Start the development server',
  handler() {
    const cmd = `webpack-dev-server --config "${getWebpackConfigPath('dev')}"`;

    console.log(
      chalk.cyan('Starting the development server at: http://localhost:8080'),
    );
    runCmd(cmd);
  },
};
