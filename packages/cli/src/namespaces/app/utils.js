const chalk = require('chalk');
const { fromCwd } = require('quickenv');

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
  simulator: {
    description:
      'Add the mamba simulator to the bundle (automatically added to target "browser")',
    alias: ['s'],
    default: false,
  },
};

exports.getWebpackConfigPath = id =>
  fromCwd('node_modules', '@mamba', 'webpack', `config.${id}.js`);
