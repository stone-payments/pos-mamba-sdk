import * as webpack from 'webpack';
import { merge } from 'webpack-merge';

// import DashboardPlugin from 'webpack-dashboard/plugin';
import type { Configuration as WebpackConfiguration } from 'webpack';
import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

// BASE CONFIG
import appConfig from './config.app';

// HELPERS
import fromWorkingDir from './helpers/fromWorkingDir';
import * as Consts from './helpers/constants';

delete process.env.TS_NODE_PROJECT;

const { HOST_SERVER, PORT } = Consts.default;

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = merge<webpack.Configuration>(appConfig, {
  devtool: 'source-map',
  optimization: {
    emitOnErrors: false,
    moduleIds: 'named',
    runtimeChunk: 'single',
  },

  infrastructureLogging: {
    appendOnly: false,
    level: 'error',
    colors: true,
  },

  devServer: {
    static: {
      directory: fromWorkingDir('src'),
    },
    compress: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    },
    host: HOST_SERVER,

    devMiddleware: {
      publicPath: `http://${HOST_SERVER}:${PORT}/`,
    },
    allowedHosts: ['all'],

    client: {
      logging: 'error',
      progress: false,
      overlay: {
        warnings: false,
        errors: true,
      },
    },
    port: PORT,
    historyApiFallback: true,
  },
});

export default config;
