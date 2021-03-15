const chalk = require('chalk');
const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin');
const { minify: htmlMinifier } = require('html-minifier');

const { generateCSSReferences, generateJSReferences } = MiniHtmlWebpackPlugin;

const { IS_BROWSER, IS_DEV, WEINRE_IP } = require('./consts.js');

module.exports = ({ css, js, title, publicPath }) => {
  console.log('WEINRE_IP: ', WEINRE_IP);
  let weinre = false;
  if (WEINRE_IP) {
    const ip = String(WEINRE_IP).trim();
    const ipRegEx = /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/gm;
    const isValidIp = ipRegEx.test(WEINRE_IP);
    if (!isValidIp) {
      chalk.yellow(
        `\n\n ⚠️ Invalid IP ${WEINRE_IP} for WEINRE_IP environment variable!`,
      );
    }

    if (isValidIp) {
      weinre = `<script src="http://${WEINRE_IP}:9000/target/target-script-min.js#anonymous"></script>`;

      process.on('exit', () =>
        console.log(
          chalk.cyan(
            '\n\n 🕵️‍♂️ Weinre(WEb INspector REmote) is enabled. \n To start server, run: ',
          ),
          chalk.yellow(
            'weinre --boundHost=-all- --httpPort=9000 --readTimeout=8 --deathTimeout=60 \n\n',
          ),
        ),
      );
    }
  }
  const htmlTemplate = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0"/>
    ${IS_BROWSER ? '<meta name="mobile-web-app-capable" content="yes">' : ''}
    <title>${title}</title>
    ${generateCSSReferences(css, publicPath)}
  </head>
  <body id="app-root">
    ${generateJSReferences(js, publicPath)}
    ${weinre || ''}
  </body>
</html>`;

  return process.env.NODE_ENV === 'production'
    ? htmlMinifier(htmlTemplate, {
        collapseWhitespace: true,
        conservativeCollapse: true,
        minifyCSS: true,
        minifyJS: true,
        keepClosingSlash: true,
        preserveLineBreaks: false,
        removeComments: true,
      })
    : htmlTemplate;
};
