const chalk = require('chalk');
const { getWebpackConfigPath, shell } = require('../../../utils.js');
const cliArgs = require('../args.js');

/** Build the app for a specific environment */
module.exports = {
  command: 'build',
  desc: 'Build the app',
  handler({ target, development, simulator }) {
    let cmd = '';
    cmd = 'cross-env ';
    cmd += `NODE_ENV=${
      development === true ||
      (typeof development === 'number' && development > 0)
        ? 'development'
        : 'production'
    } `;
    cmd += `APP_ENV=${target} `;

    /** If development flag has a numeric value */
    if (Number.isInteger(development) && development > 0) {
      cmd += `DEBUG_LVL=${development} `;
    }

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

    if (Number.isInteger(development) && development > 0) {
      console.log(`  Debug Level: ${chalk.yellow(development)}`);
    }

    if (simulator || target === 'browser') {
      console.log(chalk.yellow('  Adding the Mamba simulator to the bundle'));
    }

    shell(cmd);
  },
  builder: yargs =>
    yargs.options({
      target: cliArgs.target,
      development: cliArgs.development,
      simulator: cliArgs.simulator,
    }),
};
