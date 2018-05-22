const shell = require('shelljs')
const { CMDS, REMOTE_HOST, REMOTE_MAINAPP_DIR } = require('../../consts')
const { remoteExec } = require('../../helpers/utils')

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
          shell.exec(`start_ssh.sh com:/dev/tty${tty}`)
        },
      )
      .command('connect', 'connect to the POS via ssh', () => {
        shell.exec(
          `ssh -tt ${REMOTE_HOST} 'cd ${REMOTE_MAINAPP_DIR}; /bin/sh -l'`,
        )
      })
      .command('stop', 'stop the MambaSystem', () => {
        console.info('Stopping MambaSystem')
        remoteExec(CMDS.stop)
      })
      .command('start', 'start the MambaSystem', () => {
        console.info('Starting MambaSystem')
        remoteExec(CMDS.start)
      })
      .command('restart', 'restart the MambaSystem', () => {
        console.info('Restarting MambaSystem')
        remoteExec(CMDS.stop, CMDS.start)
      }),
  // checkCommands(yargs, 2)
}
