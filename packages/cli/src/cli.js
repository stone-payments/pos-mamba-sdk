#!/usr/bin/env node

require('yargonaut')
  .helpStyle('green')
  .errorsStyle('red');

const yargs = require('yargs');

const appCmds = require('./namespaces/app/index.js');
const posCmds = require('./namespaces/pos/index.js');

yargs
  .usage('usage: $0 <namespace> <command>')
  .demand(1)
  .command(appCmds)
  .command(posCmds)
  .strict()

  /** Help */
  .alias('h', 'help')
  .help('help')
  .showHelpOnFail(true, 'Specify --help for available options')

  /** Init */
  .parse();
