#!/usr/bin/env node

require('yargonaut')
  .helpStyle('green')
  .errorsStyle('red');

const yargs = require('yargs');

yargs
  .usage('usage: $0 <namespace> <command>')
  .demand(1)
  .command(require('./commands/app'))
  .command(require('./commands/pos'))
  .strict()

  /** Help */
  .alias('h', 'help')
  .help('help')
  .showHelpOnFail(true, 'Specify --help for available options')

  /** Init */
  .parse();
