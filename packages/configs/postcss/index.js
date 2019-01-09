const { existsSync } = require('fs');
const { resolve } = require('path');

const postcssEasyImport = require('postcss-easy-import');
const postcssExtendRule = require('postcss-extend-rule');
const postcssAdvancedVariables = require('postcss-advanced-variables');
const postcssCalc = require('postcss-calc');
const postcssPresetEnv = require('postcss-preset-env');
const postcssAtroot = require('postcss-atroot');
const postcssPropertyLookup = require('postcss-property-lookup');
const postcssNested = require('postcss-nested');
const cssMqpacker = require('css-mqpacker');
const postcssReporter = require('postcss-reporter');
const postcssHexRGBA = require('postcss-hexrgba');
const prependImports = require('./prependImports.js');

const IS_BUILDING_APP = !!process.env.APP_ENV;

const CWD = process.cwd();

const LOCAL_THEME_PATH = resolve(CWD, 'src/theme.pcss');

const THEME_FILES = [
  '@mamba/styles/theme.pcss',
  existsSync(LOCAL_THEME_PATH) && LOCAL_THEME_PATH,
];

module.exports = {
  plugins: [
    /** Custom plugin to prepend theme imports ONLY for apps */
    IS_BUILDING_APP && prependImports({ files: THEME_FILES }),
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
    postcssAtroot(),
    postcssPropertyLookup(),
    postcssNested(),
    cssMqpacker(),
    postcssReporter({ clearReportedMessages: true }),
  ],
};
