const chalk = require('chalk');
const childProcess = require('child_process');

const {
  validateTarget,
  cliArgs,
  getWebpackConfigPath,
} = require('../utils.js');

/** Build the app for a specific environment */
module.exports = {
  command: 'build',
  desc: 'Build the app',
  handler({ target, development }) {
    validateTarget(target);

    let cmd = ``;
    cmd = `cross-env `;
    cmd += `NODE_ENV=${development ? 'development' : 'production'} `;
    cmd += `APP_ENV=${target} `;
    cmd += `webpack --config "${getWebpackConfigPath('build')}"`;

    console.log(
      chalk.blue(
        `Building for ${chalk.yellow(
          development ? 'development' : 'production',
        )} '${target.toUpperCase()}'`,
      ),
    );

    childProcess.execSync(cmd, { stdio: 'inherit' });
  },
  builder: yargs =>
    yargs.options({
      target: cliArgs.target,
      development: cliArgs.development,
    }),
};
