import { join } from 'node:path';
import { existsSync } from 'node:fs';
import * as webpack from 'webpack';
import { merge } from 'webpack-merge';

// PLUGINS
import FileManagerPlugin from 'filemanager-webpack-plugin';
import CSSMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

import MambaManifestPlugin from './plugins/MambaManifestPlugin';
import PKG from '../../package.json';

// HELPERS
import { BUNDLE_NAME, IS_PROD, ORG_ASSETS_FOLDER } from '../configs/envModes.cjs';
import fromWorkingDir from './helpers/fromWorkingDir';

// BASE CONFIG
import appConfig from './config.app';

const hasOrgFolder = existsSync(join(fromWorkingDir('src'), ORG_ASSETS_FOLDER));

const config: webpack.Configuration = merge<webpack.Configuration>(appConfig, {
  devtool: false,
  plugins: [
    // Generate mamba xml manifest
    new MambaManifestPlugin(),

    // Copy and generate static files to bundle
    new FileManagerPlugin({
      events: {
        onStart: {
          delete: [`dist/${BUNDLE_NAME}`, `dist/${BUNDLE_NAME}.tar.gz`, `dist/${BUNDLE_NAME}.ppk`],
        },
        onEnd: {
          copy: [
            {
              source: `src/${PKG.mamba.iconPath}`,
              destination: `dist/${BUNDLE_NAME}/${PKG.mamba.iconPath}`,
            },
            hasOrgFolder && {
              source: `src/${ORG_ASSETS_FOLDER}`,
              destination: `dist/${BUNDLE_NAME}/${ORG_ASSETS_FOLDER}`,
            },
          ].filter(Boolean) as { source: string; destination: string }[],
          archive: [
            {
              source: `dist/${BUNDLE_NAME}/`,
              destination: `dist/${BUNDLE_NAME}.tar.gz`,
              format: 'tar',
              options: {
                gzip: true,
                gzipOptions: { level: 1 },
              },
            },
            {
              source: `dist/${BUNDLE_NAME}/`,
              destination: `dist/${PKG.name}_v${PKG.version}.ppk`,
              format: 'zip',
              options: {
                gzip: true,
                gzipOptions: { level: 1 },
              },
            },
          ],
        },
      },
      context: process.cwd(),
    }),

    /** Generate hashes based on module's relative path */
    IS_PROD && new webpack.ids.HashedModuleIdsPlugin(),
  ].filter(Boolean) as webpack.WebpackPluginInstance[],
  optimization: {
    minimize: IS_PROD,
    moduleIds: 'deterministic',
    minimizer: [
      /** Minify the bundle's css */
      new CSSMinimizerPlugin(),

      /** Minify the bundle's js */
      new TerserPlugin({
        extractComments: false,
        parallel: true,
        terserOptions: {
          safari10: true,
          compress: {
            /** Disabling this option sometimes improves performance of the output code */
            reduce_funcs: false,
            keep_infinity: true,
            pure_funcs: [
              'classCallCheck',
              '_classCallCheck',
              '_possibleConstructorReturn',
              'Object.freeze',
              'invariant',
              'warning',
            ],
          },
          mangle: {
            keep_fnames: false,

            /** Prevent renaming of `process.env...` */
            reserved: ['process'],
          },
        },
      }),
    ],
  },
});

export default config;
