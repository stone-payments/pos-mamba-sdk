import nodeResolve from 'rollup-plugin-node-resolve'
import cjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import filesize from 'rollup-plugin-filesize'
// import eslint from 'rollup-plugin-eslint'
import svelte from 'rollup-plugin-svelte'
import serve from 'rollup-plugin-serve'
import virtual from 'rollup-plugin-virtual'
import livereload from 'rollup-plugin-livereload'
import html from '@gen/rollup-plugin-generate-html'
import replace from 'rollup-plugin-replace'
import { getPkg } from 'quickenv'

import posixify from './helpers/posixify'
import makeRollupConfig from './helpers/makeRollupConfig'
import copyStaticArtifacts from './helpers/copyStaticArtifacts'

const { fromWorkspace, fromProject } = require('../utils/paths.js')

const PKG = getPkg()

const STATIC_ARTIFACTS = ['assets']

/** Svelte component example build config */
const config = {
  /** Use the virtual module __entry__ as the input for rollup */
  input: '__entry__',
  output: 'example/bundle.js',
  format: 'umd',
  experimentalDynamicImport: true,
  plugins: [
    /** Virtual entry module to bootstrap the example app */
    virtual({
      __entry__: `import App from '${posixify(
        fromWorkspace('example', 'Example.html'),
      )}'
        new App({ target: document.getElementById('root') })`,
    }),
    nodeResolve({
      extensions: ['.js', '.svelte', '.html'],
    }),
    cjs(),
    /** Compile svepte components and extract its css to <workspaceDir>/example/style.css */
    svelte(require(fromProject('svelte.config.js'))),
    babel({
      /** Enforce usage of '.babelrc.js' at the project's root directory */
      babelrc: false,
      ...require(fromProject('.babelrc.js')),
      externalHelpers: true,
      exclude: /node_modules[/\\](?!(svelte)|(@mamba))/,
    }),
    filesize(),
    copyStaticArtifacts(STATIC_ARTIFACTS)('example'),
    /** Create an html template in the example directory */
    html({
      template: fromProject(
        'tools',
        'rollup',
        'helpers',
        'componentExampleTemplate.html',
      ),
    }),
    /** Create a server with '<workspaceDir>/example' as the root */
    serve({
      open: true,
      contentBase: [
        './example',
        './',
        /**
         * We add each @mamba/dependency src path to the server
         * since rollup doesn't have something like 'css-loader' to
         * automatically copy the required assets via css url().
         */
        ...Object.keys(PKG.dependencies || {})
          .concat(Object.keys(PKG.devDependencies || {}))
          .concat(Object.keys(PKG.peerDependencies || {}))
          .filter(dep => dep.match(/@mamba/))
          .map(dep => fromWorkspace('node_modules', dep, 'src')),
      ],
    }),
    /** Reload the serve on file changes */
    livereload(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
}

export default makeRollupConfig(config)
