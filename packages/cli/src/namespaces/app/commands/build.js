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
  handler({ target, development, simulator }) {
    validateTarget(target);

    let cmd = '';
    cmd = 'cross-env ';
    cmd += `NODE_ENV=${development ? 'development' : 'production'} `;
    cmd += `APP_ENV=${target} `;
    if (simulator || target === 'browser') {
      cmd += 'MAMBA_SIMULATOR=true ';
    }
    cmd += `webpack --config "${getWebpackConfigPath('build')}"`;

    console.log(chalk.cyan('Building app...'));
    console.log(`  App target: ${chalk.yellow(target.toUpperCase())}`);
    console.log(
      `  Environment: ${chalk.yellow(
        (development ? 'development' : 'production').toUpperCase(),
      )}`,
    );

    if (simulator || target === 'browser') {
      console.log(chalk.yellow('  Adding the Mamba simulator to the bundle'));
    }

    childProcess.execSync(cmd, { stdio: 'inherit' });
  },
  builder: yargs =>
    yargs.options({
      target: cliArgs.target,
      development: cliArgs.development,
      simulator: cliArgs.simulator,
    }),
};
