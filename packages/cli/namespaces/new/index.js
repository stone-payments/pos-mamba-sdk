module.exports = {
  command: 'new <command>',
  desc: 'Creation of new mamba related structures',
  builder: (yargs) => yargs.demand(2).commandDir('./commands'),
};
