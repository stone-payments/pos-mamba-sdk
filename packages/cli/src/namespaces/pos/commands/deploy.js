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
  builder: {
    database: {
      description: 'Ships database files with deployment',
      default: false,
    },
  },
  handler({ database }) {
    console.log('Moving files to POS...');
    shell([
      `rsync -zzaP --checksum ${
        database ? '' : `--exclude 'sys/db/'`
      } -e "ssh -i ${LOCAL_KEY} -p ${REMOTE_PORT}" $MAMBA/deploy/ ${REMOTE_HOST}:/${REMOTE_MAINAPP_DIR}`,
    ]);

    console.info('\nSuccess! Deployment done.');
  },
};
