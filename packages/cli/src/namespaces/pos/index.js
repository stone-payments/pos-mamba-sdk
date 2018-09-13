const { CMDS } = require('../../consts.js');
const { runCmd, remoteExec } = require('../../utils.js');

const getStartCMD = background => (background ? CMDS.startBg : CMDS.start);

const startOpts = {
  background: {
    description: 'Starts the MambaSystem in background',
    default: false,
    alias: ['bg'],
  },
};

module.exports = {
  command: 'pos <command>',
  desc: 'POS related commands',
  builder: yargs =>
    yargs
      .demand(2)
      .command(
        'ssh-init',
        'initializes the POS ssh server',
        {
          tty: {
            description: 'Connected POS tty',
            default: 'Pos0',
          },
        },
        ({ tty }) => {
          runCmd('xcb kill-server');
          runCmd(`start_ssh.sh com:/dev/tty${tty}`);
        },
      )
      .command('stop', 'stop the MambaSystem', () => {
        console.info('Stopping MambaSystem');
        remoteExec(CMDS.stop);
      })
      .command(
        'start',
        'start the MambaSystem',
        startOpts,
        ({ background }) => {
          console.info('Starting MambaSystem');
          remoteExec(getStartCMD(background));
        },
      )
      .command(
        'restart',
        'restart the MambaSystem',
        startOpts,
        ({ background }) => {
          console.info('Restarting MambaSystem');
          remoteExec(CMDS.stop, getStartCMD(background));
        },
      ),
};
