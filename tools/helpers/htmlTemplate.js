const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin')
const { generateCSSReferences, generateJSReferences } = MiniHtmlWebpackPlugin

module.exports = ({ css, js, title, publicPath }) =>
  `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      ${generateCSSReferences(css, publicPath)}
    </head>
    <body>
      <div id="root"></div>
      ${generateJSReferences(js, publicPath)}
    </body>
  </html>`
