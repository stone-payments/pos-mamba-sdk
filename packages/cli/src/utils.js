const shell = require('shelljs');
const { REMOTE_MAINAPP_DIR } = require('./consts.js');

exports.remoteExec = (...cmdList) => {
  shell.exec(`ssh POS 'cd ${REMOTE_MAINAPP_DIR}; ${cmdList.join(';')}'`);
};

exports.removeDiacritics = str =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
