const { existsSync } = require('fs');
const { resolve } = require('path');

const postcssEasyImport = require('postcss-easy-import');
const postcssExtendRule = require('postcss-extend-rule');
const postcssAdvancedVariables = require('postcss-advanced-variables');
const postcssCalc = require('postcss-calc');
const postcssPresetEnv = require('postcss-preset-env');
const postcssNested = require('postcss-nested');
const cssMqPacker = require('css-mqpacker');
const postcssReporter = require('postcss-reporter');
const postcssHexRGBA = require('postcss-hexrgba');
const prependImports = require('./prependImports.js');

const CWD = process.cwd();

const IS_BUILDING_APP = !!process.env.APP_ENV;
const LOCAL_THEME_PATH = resolve(CWD, 'src/theme.pcss');

const THEME_FILES = [
  '@mamba/styles/theme.pcss',
  IS_BUILDING_APP && existsSync(LOCAL_THEME_PATH) && LOCAL_THEME_PATH,
];

module.exports = {
  plugins: [
    /** Custom plugin to prepend theme imports ONLY for apps */
    prependImports({ files: THEME_FILES }),
    postcssEasyImport({
      extensions: ['.css', '.pcss'],
    }),
    postcssExtendRule(),
    postcssAdvancedVariables(),
    postcssCalc({
      warnWhenCannotResolve: true,
    }),
    postcssHexRGBA(),
    postcssPresetEnv({
      stage: 2 /** Defaults postcss-preset-env to stage 2 */,
      features: {
        'custom-properties': {
          preserve: false,
        },
      },
    }),
    postcssNested(),
    cssMqPacker(),
    postcssReporter({ clearReportedMessages: true }),
  ],
};
