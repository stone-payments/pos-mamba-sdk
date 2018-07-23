const shell = require('shelljs')
const { REMOTE_MAINAPP_DIR } = require('../consts')

exports.slugify = text =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')

exports.remoteExec = (...cmdList) => {
  shell.exec(`ssh POS 'cd ${REMOTE_MAINAPP_DIR}; ${cmdList.join(';')}'`)
}
