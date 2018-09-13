/** Reusable yargs options */
module.exports = {
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
