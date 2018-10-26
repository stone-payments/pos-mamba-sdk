const { shell } = require('../../../utils.js');

const {
  LOCAL_KEY,
  REMOTE_PORT,
  REMOTE_HOST,
  REMOTE_MAINAPP_DIR,
} = require('../../../consts.js');

module.exports = {
  command: 'deploy',
  description: 'Deploy the Mamba system to the POS',
  handler() {
    console.log('Moving files to POS...');

    shell([
      `rsync -zzaP -e "ssh -i ${LOCAL_KEY} -p ${REMOTE_PORT}" $MAMBA/deploy/ ${REMOTE_HOST}:/${REMOTE_MAINAPP_DIR} --checksum`,
    ]);

    console.info('\nSuccess! Deployment done.');
  },
};
