/**
 * Webpack configuration for active development
 */
const webpack = require('webpack');
const merge = require('webpack-merge');
const { fromCwd } = require('quickenv');
const bodyParser = require('body-parser');

module.exports = merge(require('./config.app.js'), {
  devtool: 'eval-source-map',

  plugins: [new webpack.HotModuleReplacementPlugin()],

  optimization: {
    namedModules: true,
    noEmitOnErrors: true,
  },

  devServer: {
    contentBase: [fromCwd('src')],
    compress: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    },
    host: '0.0.0.0',
    open: false,
    overlay: {
      warnings: false,
      errors: true,
    },
    inline: true,
    port: 8080,
    publicPath: 'http://localhost:8080/',
    hot: true,
    before: function BeforeMid(app) {
      app.use(bodyParser.json());
      app.post('/POS_LOGGER', function POS_LOGGER(req, res) {
        const { level, text } = req.body;
        switch (level) {
          case 'info':
            console.log(`\x1B[35m${text}\x1B[0m`);
            break;
          case 'warn':
            console.log(`\x1B[33m${text}\x1B[0m`);
            break;
          case 'error':
            console.log(`\u001b[1;31m${text}\u001b[0m`);
            break;
          default:
            console.log(text);
            break;
        }
        res.sendStatus(200);
      });
    },
  },
});
