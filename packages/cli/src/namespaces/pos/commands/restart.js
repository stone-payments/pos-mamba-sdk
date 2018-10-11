const {
  remoteExec,
} = require('../../../utils.js');

const {
  CMDS,
} = require('../../../consts.js');

const getStartCMD = background => (background ? CMDS.startBg : CMDS.start);

module.exports = {
  command: '',
  description: 'restart the MambaSystem',
  builder: {
    background: {
      description: 'Starts the MambaSystem in background',
      default: false,
      alias: ['bg'],
    },
  },
  handle({
    background,
  }) {
    console.info('Restarting MambaSystem');
    remoteExec(CMDS.stop, getStartCMD(background));
  },
};
