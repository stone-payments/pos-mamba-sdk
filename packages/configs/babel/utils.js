module.exports = {
  extendPresetEnv(config, extendObj = {}) {
    /** Copy the passed config object */
    const newConfig = { ...config };

    /** Find the @babel/preset-env config */
    const presetEnvIndex = newConfig.presets.findIndex(
      ([presetName]) => presetName === '@babel/preset-env',
    );

    /** Extend the default @babel/preset-env config */
    newConfig.presets[presetEnvIndex][1] = {
      ...newConfig.presets[presetEnvIndex][1],
      ...extendObj,
    };

    return newConfig;
  },
};
