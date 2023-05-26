const { resolve } = require('node:path');

const workingDirectory = process.cwd();

exports.getWebpackPaths = (...paths) =>
  resolve(workingDirectory, 'node_modules', '@mamba', 'webpack', ...paths);
exports.getWebpackConfigPath = (id) =>
  resolve(workingDirectory, 'node_modules', '@mamba', 'webpack', `config.${id}.ts`);
