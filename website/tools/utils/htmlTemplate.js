const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin')
const { minify: htmlMinifier } = require('html-minifier')
const { generateCSSReferences, generateJSReferences } = MiniHtmlWebpackPlugin

const { IS_PROD } = require('../consts.js')

module.exports = ({ css, js, title, publicPath }) => {
  const htmlTemplate = `<!DOCTYPE html>
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

  return IS_PROD
    ? htmlMinifier(htmlTemplate, {
      collapseWhitespace: true,
      conservativeCollapse: true,
      minifyCSS: true,
      minifyJS: true,
      keepClosingSlash: true,
      preserveLineBreaks: false,
      removeComments: true,
    })
    : htmlTemplate
}
