/**
 * Webpack configuration for active development
 */
const webpack = require('webpack');
const merge = require('webpack-merge');
const { fromCwd } = require('quickenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const appCommands = require('./remote-api/commands.js');

const { COMMANDS } = appCommands;

// remot servere in=memory data
const data = [
  /* {
    id: Date.now(),
    event: EVENT_TYPE.PRINT,
    command: COMMANDS[EVENT_TYPE.PRINT].PRINT_LAST,
    payload: {
      base64: 'blah',
    },
    createdOn: new Date(),
  }, */
];

const devServer = {
  contentBase: [fromCwd('src')],
  compress: true,
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Access-Control-Allow-Origin': '*',
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
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(cors());
    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      next();
    });

    app.get('/pos-commands', (req, res) => {
      res.status(200).json(
        data.filter((item) => {
          const currentTime = new Date().getTime();
          return (currentTime - item.createdOn) / 1000 < 15;
        }),
      );
    });

    app.post('/logger', function POS_LOGGER(req, res) {
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

    app.post('/pos-commands', (req, res) => {
      const { event, command } = req.body;

      if (!COMMANDS[event]) {
        res.status(400).send(`invalid type '${event}'`);
        return;
      }

      if (!COMMANDS[event].includes(command)) {
        res.status(400).send(`invalid command '${command}'`);
        return;
      }

      const printOrder = {
        id: Date.now(),
        event,
        command,
        payload: req.body.payload || {},
        createdOn: new Date(),
      };

      data.push(printOrder);

      res.status(201).json(printOrder);
    });

    app.delete('/pos-commands/:id', (req, res) => {
      const found = data.find((item) => {
        return item.id === parseInt(req.params.id, 10);
      });

      if (found) {
        const targetIndex = data.indexOf(found);
        data.splice(targetIndex, 1);
      }

      res.sendStatus(204);
    });
  },
};

const extenralModuleOrgName = '@mamba-pkg/module-organization';
const extenralModuleOrgPath = path.join(process.cwd(), 'node_modules', extenralModuleOrgName);
const externalOrgExist = fs.existsSync(extenralModuleOrgPath);

if (externalOrgExist) {
  devServer.static = [{ directory: extenralModuleOrgPath }];
}

module.exports = merge(require('./config.app.js'), {
  devtool: 'source-map',

  plugins: [new webpack.HotModuleReplacementPlugin()],

  optimization: {
    usedExports: true,
    namedModules: true,
    noEmitOnErrors: true,
  },

  devServer,
});
