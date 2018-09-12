const { fromCwd } = require('quickenv');
const childProcess = require('child_process');

exports.runCmd = cmd => {
  try {
    childProcess.execSync(cmd, {
      stdio: [process.stdin, process.stdout, process.stderr],
    });
  } catch (error) {
    process.exit(1);
  }
};

/** Reusable yargs options */
exports.cliArgs = {
  lintType: {
    description: "The type of file to lint: 'css' or 'js'",
    alias: ['t'],
    default: undefined,
    choices: ['css', 'js'],
  },
  target: {
    description: "The target environment for the app: 'pos' or 'browser'",
    alias: ['t'],
    default: 'pos',
    choices: ['browser', 'pos'],
  },
  development: {
    description: 'Build for development environment',
    alias: ['d'],
    default: false,
  },
  simulator: {
    description:
      'Add the mamba simulator to the bundle (automatically added to target "browser")',
    alias: ['s'],
    default: false,
  },
};

exports.getWebpackConfigPath = id =>
  fromCwd('node_modules', '@mamba', 'webpack', `config.${id}.js`);
