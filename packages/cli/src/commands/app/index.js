const { hasManifest } = require('../../helpers/manifest');

module.exports = {
  command: 'app <command>',
  desc: 'Mamba apps related commands',
  builder: (yargs) => {
    if (!hasManifest) {
      console.error(
        `No "manifest.xml" found at "${process.cwd()}". Is this an mamba app directory?"`,
      );
      process.exit(1);
    }

    return yargs.demand(2).commandDir('./', {
      exclude: /index\.js/,
    });
  },
};
