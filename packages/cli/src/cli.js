#!/usr/bin/env node

const { fromCwd } = require('quickenv')
const shell = require('shelljs')
const args = require('argv').run()
const getManifest = require('./getManifest')
const { slugify } = require('./utils')

const DIST_PATH = fromCwd('dist')
const MAINAPP_PATH = 'data/app/MAINAPP'
const REMOTE_ADDRESS = 'POS'
const REMOTE_APPS_DIR = `${REMOTE_ADDRESS}:/${MAINAPP_PATH}/apps/`

const [cmd] = args.targets

const execRemote = (...cmdList) => {
  shell.exec(`ssh POS 'cd ${MAINAPP_PATH}; ${cmdList.join(';')}'`)
}

const CMDS = {
  stop: 'killall StoneMambaLoader StoneMambaSystem',
  start: './StoneMambaLoader &',
}

switch (cmd) {
  case 'deploy':
    const { displayedName: appName, id: appID } = getManifest()
    const appSlug = `${appID}-${slugify(appName)}`
    shell.exec(
      `rsync -zzaP --delete ${DIST_PATH}/ ${REMOTE_APPS_DIR}/${appSlug}.stone`,
    )
    break

  case 'stop':
    execRemote(CMDS.stop)
    break

  case 'start':
    execRemote(CMDS.start)
    break

  case 'restart':
    execRemote(CMDS.stop, CMDS.start)
    break

  default:
    throw new Error(`Invalid command "${cmd}"`)
}
