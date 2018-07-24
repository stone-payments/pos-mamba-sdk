const generalConfig = require('./index.js');
const { extendPresetEnv } = require('./utils.js');

module.exports = {
  ...extendPresetEnv(generalConfig, {}),
};
