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
        'start-ssh',
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
      )
      .command('build', 'Build MambaSystem', () => {
        runCmd('cd $MAMBA; ./mambaBuildSystem.sh');
      })
      .command('deploy', 'Deploy MambaOS build to POS.', () => {
        console.info('\nStarting MambaOS Deploy . . .');
        runCmd([
          'xcb kill-server',
          'xcb start-server',
          'xcb connect com:/dev/ttyPos0',
          'xcb installer aup $MAMBA/PAX_S920_pkg/StoneMambaSystem_lib.aup',
          'xcb installer aip $MAMBA/PAX_S920_pkg/StoneMambaSystem.aip',
          'xcb installer aip $MAMBA/PAX_S920_pkg/StoneMambaLoader.aip',
        ]);
        console.info('\nSuccess: MambaOS Deploy Done.');
      }),
};
