const pico = require('picocolors');
const { existsSync } = require('node:fs');
const { resolve } = require('node:path');

const workingDirectory = process.cwd();

const getWebpackPaths = (...paths) =>
  resolve(workingDirectory, 'node_modules', '@mamba', 'webpack', ...paths);

exports.getWebpackConfigPath = (id) =>
  resolve(workingDirectory, 'node_modules', '@mamba', 'webpack', `config.${id}.ts`);

exports.getWebpackPaths = getWebpackPaths;

exports.getTsNodeProjectPathVars = () => {
  const tsNodeProjectFileName = process.env.MAMBA_TS_NODE_FILE || 'tsconfig.node.json';
  const tsNodeProjectPath = getWebpackPaths(tsNodeProjectFileName);

  if (!existsSync(tsNodeProjectPath)) {
    throw new Error(
      pico.red(`Typescript config for @mamba/webpack not found as "${tsNodeProjectPath}"`),
    );
  }

  return `TS_NODE_PROJECT=${tsNodeProjectPath}`;
};
