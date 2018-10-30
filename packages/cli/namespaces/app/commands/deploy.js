const { fromCwd, getPkg } = require('quickenv');
const shell = require('../../../lib/shell.js');

const PKG = getPkg();

module.exports = {
  command: 'deploy',
  desc: 'Deploy the current app',
  builder: {
    force: {
      description: 'Force to upload even unchanged ones files',
      alias: ['f'],
      default: false,
    },
    legacy: {
      default: false,
    },
  },
  handler({ legacy, force }) {
    const { id } = PKG.mamba;
    const appSlug = `${id}-${PKG.name}`;

    const REMOTE_APP_DIR = `POS:/data/app/MAINAPP/apps/${appSlug}.stone`;
    const DIST_DIR = fromCwd(legacy ? 'ui/dist' : 'dist/bundle.pos');

    console.log(`Deploying "${appSlug}" to "${REMOTE_APP_DIR}"`);
    shell(
      `rsync -zzaP ${
        !force ? '--checksum' : ''
      } --delete ${DIST_DIR}/ ${REMOTE_APP_DIR}`,
    );

    if (legacy) {
      console.log(
        `Moving "manifest.xml" and "icon.bmp" to "${REMOTE_APP_DIR}/"`,
      );

      const includes = ['manifest.xml', 'icon.bmp']
        .map(path => `--include="${path}"`)
        .join(' ');

      shell(
        `rsync -zzaPR ${
          !force ? '--size-only' : ''
        } --delete ${includes} --exclude '**/*' . ${REMOTE_APP_DIR}/`,
      );
    }
    console.log('App deployed');
  },
};
