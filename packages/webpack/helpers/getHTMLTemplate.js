const os = require('os');
const chalk = require('chalk');
const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin');
const { minify: htmlMinifier } = require('html-minifier');

const { generateCSSReferences, generateJSReferences } = MiniHtmlWebpackPlugin;

const { IS_BROWSER, IS_DEV } = require('./consts.js');

const enIp = () => {
  const ifaces = os.networkInterfaces();
  const keys = Object.keys(ifaces);
  while (keys.length) {
    const ifname = keys.shift();
    if (ifname === 'en0') {
      const found = ifaces[ifname].find(
        ({ family, internal }) => family === 'IPv4' && internal === false,
      );
      return (found && found.address) || false;
    }
  }
};

module.exports = ({ css, js, title, publicPath }) => {
  let weinre = false;
  if (IS_DEV) {
    const weinreIp = enIp();
    if (weinreIp) {
      weinre = `<script src="http://${weinreIp}:9000/target/target-script-min.js#anonymous"></script>`;

      process.on('exit', () =>
        console.log(
          chalk.cyan(
            '\n\n 🕵️‍♂️ Weinre(WEb INspector REmote) is enabled. \n To start server, run: ',
          ),
          chalk.yellow(
            'weinre --boundHost=-all- --httpPort=9000 --readTimeout=8 --deathTimeout=60',
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
