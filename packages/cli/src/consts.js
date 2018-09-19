const { getPkg } = require('quickenv');

const PKG = getPkg();

if (PKG) {
  process.chdir(PKG.rootDir);
}

exports.PKG = PKG;

exports.IS_WINDOWS = process.platform === 'win32';

exports.LOCAL_KEY = '~/.ssh/id_rsa_pax';
exports.REMOTE_PORT = 51000;
exports.REMOTE_HOST = 'MAINAPP@127.0.0.1';
exports.REMOTE_MAINAPP_DIR = 'data/app/MAINAPP';
exports.REMOTE_APPS_DIR = `${exports.REMOTE_HOST}:/${
  exports.REMOTE_MAINAPP_DIR
}/apps`;

exports.CMDS = {
  ssh: `ssh ${exports.REMOTE_HOST} -p ${exports.REMOTE_PORT} -i ${
    exports.LOCAL_KEY
  }`,
  stop: 'killall StoneMambaLoader StoneMambaSystem',
  start: './StoneMambaLoader',
  startBg: './StoneMambaLoader </dev/null &>/dev/null &',
};
