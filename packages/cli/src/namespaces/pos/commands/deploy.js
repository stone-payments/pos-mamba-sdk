const {
  runCmd,
} = require('../../../utils.js');

const {
  LOCAL_KEY,
  REMOTE_PORT,
  REMOTE_HOST,
  REMOTE_MAINAPP_DIR,
} = require('../../../consts.js');

module.exports = {
  command: 'deploy',
  description: 'Deploy TermAssist Files to POS.',
  handler() {
    // init connection
    console.log('Moving files to POS...');
    runCmd([`rsync -azzvPH -e "ssh -i ${LOCAL_KEY} -p ${REMOTE_PORT}" $MAMBA/deploy ${REMOTE_HOST}:/${REMOTE_MAINAPP_DIR}`]);

    console.info('\nSuccess! Deployment done.');
  },
};
