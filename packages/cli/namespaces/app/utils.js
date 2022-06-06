const { fromCwd } = require('quickenv');

exports.getWebpackConfigPath = (id) =>
  fromCwd('node_modules', '@mamba', 'webpack', `config.${id}.js`);
