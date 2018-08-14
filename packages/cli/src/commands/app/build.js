const chalk = require('chalk');
const childProcess = require('child_process');
const { getWebpackConfigPath } = require('../../utils.js');
const { validateTarget, options } = require('./utils');

/** Build the app for a specific environment */
module.exports = {
  command: 'build',
  desc: 'Build the app',
  handler({ target, production }) {
    validateTarget(target);

    let cmd = ``;
    cmd = `cross-env `;
    cmd += `NODE_ENV=${production ? 'production' : 'development'} `;
    cmd += `APP_ENV=${target} `;
    cmd += `webpack --config "${getWebpackConfigPath('build')}"`;

    console.log(
      chalk.blue(
        `Building for ${chalk.yellow(
          production ? 'production' : 'development',
        )} '${target.toUpperCase()}'`,
      ),
    );
    childProcess.execSync(cmd, { stdio: 'inherit' });
  },
  builder: yargs =>
    yargs
      .options({
        target: options.target,
      })
      .option('production', {
        description: 'Build for production environment',
        alias: ['p'],
        default: false,
      }),
};
