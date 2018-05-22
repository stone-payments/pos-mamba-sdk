#!/usr/bin/env node
const yargs = require('yargs')

yargs
  .usage('usage: $0 <command>')
  .command(require('./commands/app'))
  .command(require('./commands/pos'))
  .strict()

  /** Help */
  .alias('h', 'help')
  .help('help')
  .showHelpOnFail(true, 'Specify --help for available options')

  /** Init */
  .parse()
