#!/usr/bin/env node

const { fromCwd } = require('quickenv')
const shell = require('shelljs')
const yargs = require('yargs')
const getManifest = require('./getManifest')
const { slugify } = require('./utils')

const DIST_PATH = fromCwd('dist')
const REMOTE_HOST = 'POS'
const REMOTE_MAINAPP_DIR = 'data/app/MAINAPP'
const REMOTE_APPS_DIR = `${REMOTE_HOST}:/${REMOTE_MAINAPP_DIR}/apps/`

const execRemote = (...cmdList) => {
  shell.exec(`ssh POS 'cd ${REMOTE_MAINAPP_DIR}; ${cmdList.join(';')}'`)
}

const CMDS = {
  stop: 'killall StoneMambaLoader StoneMambaSystem',
  start: './StoneMambaLoader  </dev/null &>/dev/null &',
}

const checkCommands = (yargs, min) => {
  if (yargs.argv._.length < min) {
    yargs.showHelp()
  }
}

yargs
  .usage('usage: $0 <command>')
  .command('app', 'Apps related functionalities', yargs => {
    yargs.command('deploy', 'deploy the current app', () => {
      const { displayedName: appName, id: appID } = getManifest()
      const appSlug = `${appID}-${slugify(appName)}`
      shell.exec(
        `rsync -zzaP --delete ${DIST_PATH}/ ${REMOTE_APPS_DIR}/${appSlug}.stone`,
        {
          silent: true,
        },
      )
      console.log('App deployed')
    })
    checkCommands(yargs, 2)
  })
  .command('pos', 'POS related functionalities', yargs => {
    yargs
      .usage('usage: mamba pos <command>')
      .command('ssh-init', 'initializes the POS ssh server', () => {
        shell.exec('start_ssh.sh com:/dev/ttyPos0')
      })
      .command('connect', 'connect to the POS via ssh', () => {
        shell.exec(
          `ssh -tt ${REMOTE_HOST} 'cd ${REMOTE_MAINAPP_DIR}; /bin/sh -l'`,
        )
      })
      .command('stop', 'stop the Mamba OS', () => {
        console.info('Stopping Mamba OS')
        execRemote(CMDS.stop)
      })
      .command('start', 'start the Mamba OS', () => {
        console.info('Starting Mamba OS')
        execRemote(CMDS.start)
      })
      .command('restart', 'restart the Mamba OS', () => {
        console.info('Restarting Mamba OS')
        execRemote(CMDS.stop, CMDS.start)
      })
    checkCommands(yargs, 2)
  })
  .strict()
  .help()
  .parse()
