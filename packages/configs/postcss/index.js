import resolve from 'resolve';
import { existsSync } from 'node:fs';

import easyImport from 'postcss-easy-import';

import sorting from 'postcss-sorting';
import extendRule from 'postcss-extend-rule';
import calc from 'postcss-calc';
import hexRGBA from 'postcss-hexrgba';
import nested from 'postcss-nested';
import reporter from 'postcss-reporter';
import advancedVariables from 'postcss-advanced-variables';
import cssVariables from 'postcss-css-variables';

import combineDuplicated from 'postcss-combine-duplicated-selectors';
import autoprefix from 'autoprefixer';
import flexFix from 'postcss-flexbugs-fixes';
import presetEnv from 'postcss-preset-env';
import env from '../envModes.cjs';

const postcssUniqueImports = require('./includes/uniqueImports.js');
const unthrow = require('./includes/unthrow.js');
const colorsMamba = require('../../styles/colors.js');

const globalThemeFile = unthrow(() => resolve.sync('@mamba/styles/theme.pcss'));
const appThemeFile = fromCwd('src/theme.pcss');

const { IS_PROD, APP_ENV } = env;
const isBuildingApp = typeof APP_ENV !== 'undefined';

export default {
  plugins: [
    /** Custom plugin to prepend imports */
    postcssUniqueImports.plugin([
      globalThemeFile && '@mamba/styles/theme.pcss',
      /** If building an app, append the local theme file */
      isBuildingApp && existsSync(appThemeFile) && appThemeFile,
    ]),
    easyImport({
      extensions: ['.css', '.pcss'],
    }),
    cssVariables({
      preserve: false,
    }),
    sorting(),
    extendRule(),
    advancedVariables({
      variables: colorsMamba,
    }),
    hexRGBA(),
    nested(),
    presetEnv({
      stage: 2,
      features: {
        'custom-properties': false,
      },
    }),
    calc({
      warnWhenCannotResolve: true,
    }),

    IS_PROD && combineDuplicated({ removeDuplicatedProperties: false }),
    flexFix(),
    autoprefix(),
    reporter({ clearReportedMessages: false }),
  ].filter(Boolean),
};
