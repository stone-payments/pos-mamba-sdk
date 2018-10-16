const {
  remoteExec,
} = require('../../../utils.js');

const {
  CMDS,
} = require('../../../consts.js');

const getStartCMD = background => (background ? CMDS.startBg : CMDS.start);

module.exports = {
  command: 'restart',
  description: 'restart the MambaSystem',
  builder: {
    background: {
      description: 'Starts the MambaSystem in background',
      default: false,
      alias: ['bg'],
    },
  },
  handler({
    background,
  }) {
    console.info('Restarting MambaSystem');
    remoteExec(CMDS.stop, getStartCMD(background));
  },
};
