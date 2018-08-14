const childProcess = require('child_process');
const chalk = require('chalk');
const { getWebpackConfigPath } = require('../../utils.js');

/** Start the webpack development server */
module.exports = {
  command: 'dev',
  desc: 'Start the development server',
  handler() {
    const cmd = `webpack-dev-server --config "${getWebpackConfigPath('dev')}"`;

    console.log(
      chalk.blue(`Starting the development server at: http://localhost:8080`),
    );
    childProcess.execSync(cmd, { stdio: 'inherit' });
  },
};
