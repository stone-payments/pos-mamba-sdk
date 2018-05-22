exports.REMOTE_HOST = 'POS'
exports.REMOTE_MAINAPP_DIR = 'data/app/MAINAPP'
exports.REMOTE_APPS_DIR = `${exports.REMOTE_HOST}:/${
  exports.REMOTE_MAINAPP_DIR
}/apps`

exports.CMDS = {
  stop: 'killall StoneMambaLoader StoneMambaSystem',
  start: './StoneMambaLoader  </dev/null &>/dev/null &',
}
