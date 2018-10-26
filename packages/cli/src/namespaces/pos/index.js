const { resolve } = require('path');
const { homedir } = require('os');
const { existsSync } = require('fs');

const POSTOOLS_DIR = resolve(homedir(), '.postools', 'cli', 'commands');

module.exports = {
  command: 'pos <command>',
  desc: 'POS related commands',
  builder: yargs => {
    yargs = yargs.demand(2).commandDir('./commands');

    if (existsSync(POSTOOLS_DIR)) {
      yargs = yargs.commandDir(POSTOOLS_DIR);
    }

    return yargs;
  },
};
