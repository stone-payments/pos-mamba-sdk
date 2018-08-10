/**
 * Common webpack configuration
 */
const MiniHtmlWebpackPlugin = require('mini-html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const { getPkg, fromCwd } = require('quickenv');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const {
  BUNDLE_NAME,
  IS_POS,
  IS_BROWSER,
  IS_DEV,
  IS_PROD,
  NODE_ENV,
  APP_ENV,
} = require('./helpers/consts.js');
const htmlTemplate = require('./helpers/htmlTemplate.js');
const loaders = require('./helpers/loaders.js');
const MambaFixesPlugin = require('./helpers/MambaFixesPlugin.js');

const PKG = getPkg();
/**
 * Separate the app dependencies in two lists.
 * Since we have to polyfill every dependency with @babel/preset-env,
 * we must split our dependencies into module types for babel
 * to correctly append the "import" or the "require" statement
 * */
// const ES_DEPS = [];
// const CJS_DEPS = [];
// Object.keys(PKG.dependencies).forEach(libName => {
//   const path = fromCwd('node_modules', libName);
//   const pkg = getPkg({ path });
//   if (pkg.module || pkg['jsnext:main'] || pkg.esnext) {
//     ES_DEPS.push(path);
//   } else {
//     CJS_DEPS.push(path);
//   }
// }, {});

/** Get a map of all the project's dependencies */
const dependencyMap = Object.keys(PKG.dependencies).reduce((acc, libName) => {
  acc[libName] = fromCwd('node_modules', libName);
  return acc;
}, {});

/** App entry point */
const entry = {
  app: [
    /** Mamba style resetter/normalizer */
    '@mambasdk/styles/dist/pos.css',
    /** Load the simulator bootstrap */
    IS_BROWSER && './simulator.js',
    /** App entry point */
    './index.js',
  ].filter(Boolean),
};

module.exports = {
  mode: IS_PROD ? 'production' : 'development',
  cache: true,
  target: 'web',
  context: fromCwd('src'),
  entry,
  output: {
    path: fromCwd(BUNDLE_NAME),
    publicPath: './',
    filename: '[name].[hash:5].js',
    chunkFilename: '[name].[hash:5].js',
  },
  resolve: {
    /** Do not resolve symlinks */
    symlinks: false,
    mainFields: ['svelte', 'jsnext:main', 'esnext', 'module', 'main'],
    extensions: ['.js', '.json', '.pcss', '.css', '.html', '.htmlx', '.svelte'],
    /** Make webpack also resolve modules from './src' */
    modules: [fromCwd('src'), 'node_modules'],
    alias: {
      '@mambasdk': fromCwd('node_modules', '@mambasdk'),
    },
  },
  module: {
    rules: [
      /** Run svelte component related loaders on  */
      {
        test: /\.(htmlx?|svelte)$/,
        exclude: [/node_modules[\\/].+[\\/]node_modules/],
        use: [loaders.babelEsNext, loaders.svelte, loaders.eslint],
      },
      /**
       * Run app COMMONJS dependencies through babel with module: 'commonjs'.
       * @babel/preset-env inserts es6 import if we don't pass "module: 'commonjs'",
       * resulting in mixed es6 and commonjs code.
       * */
      {
        test: /\.js$/,
        resolve: {
          mainFields: ['main'],
        },
        include: Object.values(dependencyMap),
        exclude: [/node_modules[\\/].+[\\/]node_modules/],
        use: [loaders.babelCJS],
      },
      /** Run app ES6 dependencies through babel */
      {
        test: /\.js$/,
        resolve: {
          mainFields: ['jsnext:main', 'esnext', 'module'],
        },
        include: Object.values(dependencyMap),
        exclude: [/node_modules[\\/].+[\\/]node_modules/],
        use: [loaders.babelEsNext],
      },
      /** Run babel and eslint on projects src files only */
      {
        test: /\.js$/,
        include: [fromCwd('src')],
        use: [loaders.babelEsNext, loaders.eslint],
      },
      {
        test: /\.(css|pcss)$/,
        /** When importing from a style file, let's
         * use package.json's 'style' field before
         * the actual 'main' one
         * */
        resolve: { mainFields: ['style', 'main'] },
        use: [
          loaders.extractCss,
          loaders.css,
          loaders.postcss,
          loaders.resolveUrl,
        ],
      },
      /** Handle font imports */
      { test: /\.(eot|woff2?|otf|ttf)$/, use: [loaders.fonts] },
      /** Handle image imports */
      { test: /\.(gif|jpe?g|png|ico|svg)$/, use: [loaders.images] },
    ],
  },
  plugins: [
    /** Prepend the Function.prototype.bind() polyfill webpack's runtime code */
    new MambaFixesPlugin(),
    new ProgressBarPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[name].[hash:5].css',
    }),
    new MiniHtmlWebpackPlugin({
      context: { title: 'Mamba Application' },
      template: htmlTemplate,
    }),
    new webpack.DefinePlugin({
      __NODE_ENV__: JSON.stringify(NODE_ENV),
      __APP_ENV__: JSON.stringify(APP_ENV),
      __PROD__: IS_PROD,
      __TEST__: NODE_ENV === 'test',
      __DEV__: IS_DEV,
      __POS__: IS_POS,
      __BROWSER__: IS_BROWSER,
    }),
  ],
  /** Minimal useful output log */
  stats: {
    modules: false,
    chunks: false,
    colors: true,
    children: false,
  },
  optimization: {
    namedChunks: true,
    namedModules: true,
    /** Create a separate chunk for webpack runtime */
    runtimeChunk: { name: 'runtime' },
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      minChunks: 1,
      cacheGroups: {
        vendors: false,
        libs: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        /** Chunk that contains used polyfills */
        polyfills: {
          test: /core-js/,
          name: 'polyfills',
          priority: 10,
        },
      },
    },
  },
};
