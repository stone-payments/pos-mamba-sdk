const chalk = require('chalk');
const { getWebpackConfigPath } = require('../utils.js');
const shell = require('../../../lib/shell.js');
const cliArgs = require('../args.js');
const { PLATFORMS } = require('../../../consts.js');

/** Build the app for a specific environment */
module.exports = {
  command: 'build',
  desc: 'Build the app',
  handler({ target, development, simulator, platform }) {
    const choseAllPlatforms = platform.some(pl => pl === 'all');
    const platforms = choseAllPlatforms ? PLATFORMS : platform;

    platforms.forEach(plat => {
      const IS_DEV =
        development === true ||
        (typeof development === 'number' && development > 0);
      const IS_DEBUG = Number.isInteger(development) && development > 0;
      const ADD_SIMULATOR = simulator || target === 'browser';

      const cmd = [
        'cross-env',
        `NODE_ENV=${IS_DEV ? 'development' : 'production'}`,
        `APP_ENV=${target}`,
        /** If development flag has a numeric value */
        IS_DEBUG && `DEBUG_LVL=${development}`,
        ADD_SIMULATOR && 'MAMBA_SIMULATOR=true',
        `PLATFORM=${plat}`,
        `webpack --config "${getWebpackConfigPath('app.build')}"`,
      ]
        .filter(Boolean)
        .join(' ');

      console.log(chalk.cyan('Building app...'));
      console.log(`  App target: ${chalk.yellow(target.toUpperCase())}`);
      console.log(
        `  Environment: ${chalk.yellow(
          (development ? 'development' : 'production').toUpperCase(),
        )}`,
      );
      if (plat) console.log(`  PLATFORM: ${chalk.yellow(plat)}`);

      if (IS_DEBUG) {
        console.log(`  Debug Level: ${chalk.yellow(development)}`);
      }

      if (ADD_SIMULATOR) {
        console.log(chalk.yellow('  Adding the Mamba simulator to the bundle'));
      }

      // When exit is false the build script keeps working to another platform even though build error.
      shell(cmd, { exit: !(choseAllPlatforms || platform.length > 1) });
    });
  },
  builder: yargs =>
    yargs.options({
      target: cliArgs.target,
      development: cliArgs.development,
      simulator: cliArgs.simulator,
      platform: cliArgs.platform,
    }),
};
