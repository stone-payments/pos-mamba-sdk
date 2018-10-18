const {
  remoteExec,
} = require('../../../utils.js');

const {
  CMDS,
} = require('../../../consts.js');

module.default = {
  command: 'stop',
  description: 'Stops Mamba System',
  handler() {
    console.info('Stopping MambaSystem');
    remoteExec(CMDS.stop);
  },
};
