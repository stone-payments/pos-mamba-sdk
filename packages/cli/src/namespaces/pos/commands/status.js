const chalk = require('chalk');
const { shell } = require('../../../utils.js');

module.exports = {
  command: 'status',
  description: 'Check if POS is connected at USB port.',
  handler() {
    const cmd = shell('ls /dev/ttyPos*', {
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
