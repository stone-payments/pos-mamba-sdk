import * as webpack from 'webpack';
import { merge } from 'webpack-merge';

// Plugins
import VirtualModulesPlugin from 'webpack-virtual-modules';

// Utils
import { fromWorkingDir } from '@mamba/utils';

// Helpers
import { BUNDLE_NAME, SDK_ASSETS_FOLDER } from '@mamba/configs/envModes.cjs';
import getEntrypoints from './helpers/getEntrypoints';
import getVirtualFiles from './helpers/getVirtualFiles';

// Base config
import commonConfig from './config.common';

function resolveFileLoaderName(resourcePath: string) {
  if (/@mamba/.test(resourcePath)) {
    return `${SDK_ASSETS_FOLDER}/[name][ext][query]`;
  }
  return `assets/[path][name][ext][query]`;
}

const config: webpack.Configuration = merge<webpack.Configuration>(commonConfig, {
  devtool: false,
  entry: getEntrypoints(),
  output: {
    path: fromWorkingDir('dist', BUNDLE_NAME),
  },
  resolve: {
    modules: [fromWorkingDir('src'), 'node_modules'],
  },
  module: {
    rules: [
      /** Handle font imports */
      {
        test: /\.(eot|woff2?|otf|ttf)$/,
        type: 'asset/resource',
        generator: {
          filename: resolveFileLoaderName,
        },
      },

      /** Handle image imports */
      {
        test: /\.(gif|jpe?g|png|ico|svg|bmp)$/,
        type: 'asset',
        generator: {
          filename: resolveFileLoaderName,
        },
      },
      {
        test: /\.txt/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 5 * 1024, // 5kb
          },
        },
        generator: {
          filename: resolveFileLoaderName,
        },
      },
    ],
  },
  plugins: [new VirtualModulesPlugin(getVirtualFiles())],
});

export default config;
