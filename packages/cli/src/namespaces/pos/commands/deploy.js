const {
  runCmd,
} = require('../../../utils.js');

module.exports = {
  command: 'deploy',
  builder: {
    all: {
      description: 'Deploys: StoneMambaSystem (Aup, Aip), StoneMambaLoader and QT.',
      alias: ['a'],
      default: true,
    },
    system: {
      description: 'Deploys StoneMambaLoader to POS.',
      alias: ['s'],
      default: false,
    },
    loader: {
      description: 'Deploys StoneMambaSystem to POS.',
      alias: ['l'],
      default: false,
    },
    qt: {
      description: 'Deploys QT Lib to POS.',
      alias: ['q'],
      default: false,
    },
  },
  description: 'Deploy TermAssist Files to POS.',
  handler({
    all,
    system,
    loader,
    qt,
  }) {
    // init connection
    runCmd(['xcb kill-server', 'xcb start-server', 'xcb connect-server']);
    if (system || all) {
      console.info('System Deployment Started\n');
      runCmd(['xcb installer aup $MAMBA/PAX_S920_pkg/StoneMambaSystem_lib.aup',
        'xcb installer aip $MAMBA/PAX_S920_pkg/StoneMambaSystem.aip',
      ]);
    }
    if (loader || all) {
      console.info('Loader Deployment Started\n');
      runCmd(['cb installer aip $MAMBA/PAX_S920_pkg/StoneMambaLoader.aip']);
    }
    if (qt || all) {
      runCmd(['xcb installer aup $MAMBA/PAX_S920_pkg/StoneMambaSystem_Qt.aup']);
    }
    console.info('\nSuccess! Deployment done.');
  },
};
