#!/usr/bin/env node
require('yargonaut').helpStyle('green').errorsStyle('red');
const yargs = require('yargs');

const externalPlugins = require('./lib/loadPlugins.js');

const plugins = [
  require('./namespaces/app/index.js'), // eslint-disable-line
  require('./namespaces/new/index.js'), // eslint-disable-line
  ...externalPlugins,
];

plugins.forEach((commandModule) => {
  if (commandModule) {
    yargs.command(commandModule);
  }
});

yargs
  .strict()
  .alias('h', 'help')
  .help('help')
  .showHelpOnFail(true, 'Specify --help for available options')
  .usage('usage: $0 <namespace> <command>')
  .demand(1)
  .parse();
