const chalk = require('chalk');

exports.validateTarget = target => {
  if (target !== 'pos' && target !== 'browser') {
    console.error(chalk.red("Invalid target. Must be 'pos' or 'browser'"));
    process.exit(1);
  }
  return true;
};

/** Reusable yargs options */
exports.options = {
  target: {
    description: "The target environment for the app: 'pos' or 'browser'",
    alias: ['t'],
    default: 'browser',
  },
};
