import * as webpack from 'webpack';
import { merge } from 'webpack-merge';

// PLUGINS
import VirtualModulesPlugin from 'webpack-virtual-modules';

// HELPERS
import { BUNDLE_NAME } from '../configs/envModes.cjs';
import fromWorkingDir from './helpers/fromWorkingDir';
import getEntrypoints from './helpers/getEntrypoints';
import getVirtualFiles from './helpers/getVirtualFiles';

// LOADERS
import { Images, Fonts } from '../configs/loaders';

// BASE CONFIG
import commonConfig from './config.common';

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

        // use: [Fonts],
        type: 'asset/resource',
      },

      /** Handle image imports */
      {
        test: /\.(gif|jpe?g|png|ico|svg|bmp)$/,

        // use: [Images],
        type: 'asset/resource',
      },
      {
        test: /\.txt/,
        type: 'asset/source',
      },
    ],
  },
  plugins: [new VirtualModulesPlugin(getVirtualFiles())],
});

export default config;
