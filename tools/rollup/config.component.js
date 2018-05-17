import { resolve } from 'path'
import { existsSync } from 'fs'
import nodeResolve from 'rollup-plugin-node-resolve'
import cjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import filesize from 'rollup-plugin-filesize'
import eslint from 'rollup-plugin-eslint'
import svelte from 'rollup-plugin-svelte'
import serve from 'rollup-plugin-serve'
import virtual from 'rollup-plugin-virtual'
import livereload from 'rollup-plugin-livereload'
import clear from 'rollup-plugin-clear'
import uglify from 'rollup-plugin-uglify'
import html from '@gen/rollup-plugin-generate-html'
import copy from 'rollup-plugin-copy'
import { IS_WATCHING, IS_PROD } from 'quickenv'

import posixify from './helpers/posixify.js'
import makeRollupConfig from './helpers/makeRollupConfig.js'

const {
  fromWorkspace,
  fromSrc,
  fromDist,
  fromProject,
} = require('../utils/paths.js')

const defaultSvelteConfig = require(fromProject('svelte.config.js'))
const babelrc = require(fromProject('.babelrc.js'))

const STATIC_ARTIFACTS = ['assets']

/** rollup-plugin-copy wrapper */
const copyStaticArtifacts = distPath =>
  copy({
    verbose: true,
    ...STATIC_ARTIFACTS.reduce((acc, artifactPath) => {
      const srcPath = fromSrc(artifactPath)
      if (existsSync(srcPath)) {
        acc[fromSrc(artifactPath)] = resolve(distPath, artifactPath)
      }
      return acc
    }, {}),
  })

let config

if (IS_WATCHING()) {
  /** Svelte component example build config */
  config = {
    /** Use the virtual module __entry__ as the input for rollup */
    input: '__entry__',
    output: 'example/bundle.js',
    format: 'umd',
    watch: {
      chokidar: false,
    },
    plugins: [
      /** Virtual entry module to bootstrap the example app */
      virtual({
        __entry__: `import App from '${posixify(
          fromWorkspace('example/App.svelte'),
        )}'
        new App({ target: document.getElementById('root') })`,
      }),
      nodeResolve({
        extensions: ['.js', '.svelte', '.html'],
      }),
      cjs(),
      eslint(),
      /** Compile svelte components and extract its css to <workspaceDir>/example/style.css */
      svelte(defaultSvelteConfig),
      babel({
        exclude: 'node_modules/**',
        /** Enforce usage of '.babelrc.js' at the project's root directory */
        babelrc: false,
        ...babelrc,
      }),
      filesize(),
      copyStaticArtifacts('example'),
      /** Create an html template in the example directory */
      html({
        template: fromProject(
          'tools/rollup/helpers/componentExampleTemplate.html',
        ),
      }),
      /** Create a server with '<workspaceDir>/example' as the root */
      serve({
        open: true,
        contentBase: ['./example', './'],
      }),
      /** Reload the serve on file changes */
      livereload(),
    ],
  }
} else {
  /** Svelte component default build config */
  config = {
    format: 'umd',
    plugins: [
      /** Clear the dist directory */
      clear({
        targets: [fromDist()],
      }),
      nodeResolve({
        extensions: ['.js', '.svelte', '.html'],
      }),
      cjs(),
      eslint(),
      /** Compile svelte components and extract its css to <distFolder>/style.css */
      svelte({
        ...defaultSvelteConfig,
        css(css) {
          css.write(fromDist('style.css'), false)
        },
      }),
      babel({
        exclude: 'node_modules/**',
        /** Enforce usage of '.babelrc.js' at the project's root directory */
        babelrc: false,
        ...babelrc,
      }),
      filesize(),
      copyStaticArtifacts(fromDist()),
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
    ],
  }
}

export default makeRollupConfig(config)
