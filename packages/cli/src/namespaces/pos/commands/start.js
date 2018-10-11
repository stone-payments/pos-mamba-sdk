const {
  remoteExec,
} = require('../../../utils.js');

const {
  CMDS,
} = require('../../../consts.js');

const getStartCMD = background => (background ? CMDS.startBg : CMDS.start);


module.exports = {
  command: 'start',
  descripion: 'Start Mamba System',
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
    console.info('Starting MambaSystem');
    remoteExec(getStartCMD(background));
  },
};
