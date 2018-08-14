const chalk = require('chalk');
const childProcess = require('child_process');
const { getWebpackConfigPath } = require('../../utils.js');
const { validateTarget, options } = require('./utils.js');

/** Build the app for a specific environment */
module.exports = {
  command: 'analyze',
  desc: 'Analyze the app bundle',
  handler({ target }) {
    validateTarget(target);

    let cmd = ``;
    cmd = `cross-env `;
    cmd += `NODE_ENV=production `;
    cmd += `APP_ENV=${target} `;
    cmd += `webpack --config "${getWebpackConfigPath('analyzer')}"`;

    console.log(chalk.blue(`Analyzing bundle for '${target.toUpperCase()}'`));
    childProcess.execSync(cmd, { stdio: 'inherit' });
  },
  builder: yargs =>
    yargs.options({
      target: options.target,
    }),
};
