const pico = require('picocolors');
const { getWebpackConfigPath } = require('../utils.js');
const shell = require('../../../lib/shell.js');
const cliArgs = require('../args.js');
const { PLATFORMS } = require('../../../consts.js');

/** Build the app for a specific environment */
module.exports = {
  command: 'analyze',
  desc: 'Analyze the app bundle',
  handler({ target, platform }) {
    const cmd = [
      'cross-env',
      'NODE_ENV=production',
      `APP_ENV=${target}`,
      `webpack --env PLATFORM=${platform} --config "${getWebpackConfigPath('analyzer')}"`,
    ].join(' ');

    console.log(pico.cyan(`Analyzing bundle for '${target.toUpperCase()}'`));
    console.log(`PLATFORM: ${pico.yellow(platform)}`);

    shell(cmd);
  },
  builder: (yargs) =>
    yargs.options({
      target: cliArgs.target,
      platform: {
        description: 'Choose the platform to analyze',
        alias: ['pl'],
        default: 'GENERIC',
        choices: [...PLATFORMS],
      },
    }),
};
