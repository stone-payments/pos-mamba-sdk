import nodeResolve from 'rollup-plugin-node-resolve'
import cjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import filesize from 'rollup-plugin-filesize'
// import eslint from 'rollup-plugin-eslint'
import svelte from 'rollup-plugin-svelte'
import clear from 'rollup-plugin-clear'
import uglify from 'rollup-plugin-uglify'
import { IS_PROD } from 'quickenv'

import copyStaticArtifacts from './helpers/copyStaticArtifacts'
import makeRollupConfig from './helpers/makeRollupConfig'

const { fromDist, fromProject } = require('../utils/paths.js')

const svelteConfig = require(fromProject('svelte.config.js'))
const babelConfig = require(fromProject('.babelrc.js'))

const STATIC_ARTIFACTS = ['assets']

/** Svelte component default build config */
const plugins = [
  clear(fromDist()),
  /** Clear the dist directory */
  nodeResolve({
    extensions: ['.js', '.svelte', '.html'],
  }),
  cjs(),
  // eslint(),
  /** Compile svelte components and extract its css to <distFolder>/style.css */
  svelte({
    ...svelteConfig,
    css(css) {
      css.write(fromDist('style.css'), false)
    },
  }),
  babel({
    exclude: 'node_modules/**',
    /** Enforce usage of '.babelrc.js' at the project's root directory */
    babelrc: false,
    ...babelConfig,
  }),
  filesize(),
  copyStaticArtifacts(STATIC_ARTIFACTS)(fromDist()),
  /** If building for production, minify the output code */
  IS_PROD() &&
    uglify({
      mangle: {
        toplevel: true,
        /** Prevent renaming of `process.env...` */
        reserved: ['process'],
      },
      output: {
        comments: false,
      },
    }),
]

const config = {
  format: 'umd',
  plugins,
  experimentalDynamicImport: true,
}

export default makeRollupConfig(config)
