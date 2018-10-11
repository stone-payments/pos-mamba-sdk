const {
  runCmd,
} = require('../../../utils.js');

module.exports = {
  command: 'start-ssh',
  description: 'initializes the POS ssh server',
  builder: {
    tty: {
      description: 'Connected POS tty',
      default: 'Pos0',
    },
  },
  handle({
    tty,
  }) {
    runCmd(['xcb kill-server', `start_ssh.sh com:/dev/tty${tty}`]);
  },
};
