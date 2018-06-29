const loaders = require('./helpers/loaders.js')
const { fromWorkspace, fromProject } = require('../../tools/utils/paths')

const mode = process.env.NODE_ENV

module.exports = function createWebpackConfig(type) {
  return {
    /** Minimal useful output log */
    stats: {
      modules: false,
      chunks: false,
      colors: true,
      children: false,
    },
    resolve: {
      /** Do not resolve symlinks */
      symlinks: true,
      mainFields: ['svelte', 'browser', 'module', 'main'],
      extensions: ['.js', '.json', '.css', '.pcss', '.html', '.svelte'],
      /** Make webpack also resolve modules from './' */
      modules: [
        fromWorkspace('./'),
        fromWorkspace('node_modules'),
        fromProject('node_modules'),
      ],
    },
    module: {
      rules: [
        // {
        //   test: /\.js?$/,
        //   include: [/node_modules[\\/]svelte/],
        //   use: [loaders.babel],
        // },
        /** Run babel and eslint on projects src files only */
        {
          test: /\.js?$/,
          include: [fromWorkspace('src')],
          use: [loaders.babel, loaders.eslint],
        },
        {
          test: /\.(html|svelte)$/,
          exclude: [/node_modules/],
          use: [loaders.babel, loaders.svelte(type)],
        },
        {
          test: /\.(css|pcss)$/,
          /** When importing from a style file, let's use package.json's 'style' field before the actual 'main' one */
          resolve: { mainFields: ['style', 'main'] },
          use: [
            loaders.styleLoader,
            loaders.css,
            loaders.resolveUrl,
            loaders.postcss,
          ],
        },
        /** Handle font imports */
        { test: /\.(eot|woff2?|otf|ttf)$/, use: [loaders.fonts] },
        /** Handle image imports */
        { test: /\.(gif|jpe?g|png|ico|svg)$/, use: [loaders.images] },
      ],
    },
    mode,
  }
}
