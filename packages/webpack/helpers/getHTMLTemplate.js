const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin');
const { minify: htmlMinifier } = require('html-minifier');

const { generateCSSReferences, generateJSReferences } = MiniHtmlWebpackPlugin;

const { IS_BROWSER } = require('./consts.js');

module.exports = ({ css, js, title, publicPath }) => {
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
