const chalk = require('chalk');
const { fromCwd } = require('quickenv');
const { PKG, IS_WINDOWS } = require('../../consts.js');

exports.validateProject = () => {
  if (PKG == null) {
    console.error(
      chalk.red(`No "package.json" found. Is this an mamba app directory?"`),
    );
    process.exit(1);
  }

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
};

exports.validateTarget = target => {
  if (target !== 'pos' && target !== 'browser') {
    console.error(chalk.red("Invalid target. Must be 'pos' or 'browser'"));
    process.exit(1);
  }
  return true;
};

/** Reusable yargs options */
exports.cliArgs = {
  target: {
    description: "The target environment for the app: 'pos' or 'browser'",
    alias: ['t'],
    default: 'pos',
  },
  development: {
    description: 'Build for development environment',
    alias: ['d'],
    default: false,
  },
};

exports.getWebpackConfigPath = id =>
  fromCwd('node_modules', '@mambasdk', 'webpack', `config.${id}.js`);
