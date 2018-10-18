module.exports = {
  command: 'pos <command>',
  desc: 'POS related commands',
  builder: yargs => yargs.demand(2).commandDir('./commands'),
};
