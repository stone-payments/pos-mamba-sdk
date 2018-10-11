const chalk = require('chalk');
const {
  runCmd,
} = require('../../../utils.js');

module.exports = {
  command: 'status',
  description: 'Check if POS is connected at USB port.',
  handler() {
    const cmd = runCmd('ls /dev/ttyPos*', {
      exit: false,
      quiet: true,
    });
    if (cmd === 0) {
      console.info(chalk.green('POS connected'));
    } else {
      console.error(chalk.red('POS not connected'));
    }
  },
};
