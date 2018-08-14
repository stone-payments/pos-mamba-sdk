const { PKG } = require('../../consts.js');

module.exports = {
  command: 'app <command>',
  desc: 'Mamba apps related commands',
  builder: yargs => {
    if (PKG.mamba === 'undefined') {
      console.error(
        `No "mamba" property found at "${process.cwd()}/package.json". Is this an mamba app directory?"`,
      );
      process.exit(1);
    }

    return yargs.demand(2).commandDir('./', {
      exclude: /index\.js/,
    });
  },
};
