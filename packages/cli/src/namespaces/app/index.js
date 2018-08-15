const { fromCwd } = require('quickenv');
const chalk = require('chalk');
const { PKG, IS_WINDOWS } = require('../../consts.js');

module.exports = {
  command: 'app <command>',
  desc: 'Mamba apps related commands',
  builder: yargs => {
    if (typeof PKG.mamba === 'undefined') {
      console.error(
        chalk.red(
          `No "mamba" property found at "${
            PKG.filePath
          }" Is this an mamba app directory?"`,
        ),
      );
      process.exit(1);
    }

    /** Add the node_modules/.bin of the current app to the PATH env variable */
    process.env.PATH +=
      (IS_WINDOWS ? ';' : `:`) + fromCwd('node_modules', '.bin');

    return yargs.demand(2).commandDir('./commands');
  },
};
