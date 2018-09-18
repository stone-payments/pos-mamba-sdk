const { getPkg } = require('quickenv');

const PKG = getPkg();

if (PKG) {
  process.chdir(PKG.rootDir);
}

exports.PKG = PKG;

exports.IS_WINDOWS = process.platform === 'win32';

exports.REMOTE_HOST = 'POS';
exports.REMOTE_MAINAPP_DIR = 'data/app/MAINAPP';
exports.REMOTE_APPS_DIR = `${exports.REMOTE_HOST}:/${
  exports.REMOTE_MAINAPP_DIR
}/apps`;

exports.CMDS = {
  ssh: `ssh MAINAPP@127.0.0.1 -p 51000 -i ~/.ssh/id_rsa_pax`,
  stop: 'killall StoneMambaLoader StoneMambaSystem',
  start: './StoneMambaLoader',
  startBg: './StoneMambaLoader </dev/null &>/dev/null &',
};
