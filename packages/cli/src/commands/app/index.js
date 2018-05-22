module.exports = {
  command: 'app <command>',
  desc: 'Mamba apps related tasks',
  builder: yargs =>
    yargs.demand(2).commandDir('./', {
      exclude: /index\.js/,
    }),
}
