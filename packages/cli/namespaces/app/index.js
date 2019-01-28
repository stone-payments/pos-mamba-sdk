const { fromCwd, getPkg } = require('quickenv');
const chalk = require('chalk');

const PKG = getPkg();

module.exports = {
  command: 'app <command>',
  desc: 'Mamba apps related commands',
  builder: yargs => {
    if (PKG == null) {
      console.error(
        chalk.red('No "package.json" found. Is this a mamba app directory?"'),
      );
      process.exit(1);
    }
    process.chdir(PKG.rootDir);

    if (typeof PKG.mamba === 'undefined') {
      console.error(
        chalk.red(
          `No "mamba" property found at "${
            PKG.rootDir
          }" Is this an mamba app directory?"`,
        ),
      );
      process.exit(1);
    }

    /** Add the node_modules/.bin of the current app to the PATH env variable */
    process.env.PATH +=
      (process.platform === 'win32' ? ';' : ':') +
      fromCwd('node_modules', '.bin');

    return yargs.demand(2).commandDir('./commands');
  },
};
