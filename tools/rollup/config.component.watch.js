import nodeResolve from 'rollup-plugin-node-resolve';
import cjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import svelte from 'rollup-plugin-svelte';
import serve from 'rollup-plugin-serve';
import virtual from 'rollup-plugin-virtual';
import livereload from 'rollup-plugin-livereload';
import html from '@gen/rollup-plugin-generate-html';
import replace from 'rollup-plugin-replace';
import alias from 'rollup-plugin-alias';
import image from 'rollup-plugin-url';

import { getPkg } from 'quickenv';

import { fromWorkspace, fromProject } from './helpers/paths.js';

const posixify = file => file.replace(/[/\\]/g, '/');

const babelConfig = require('../../.babelrc.js');
const svelteConfig = require('../../svelte.config.js');

const PKG = getPkg();

/** Svelte component example build config */
export default {
  /** Use the virtual module __entry__ as the input for rollup */
  input: '__entry__',
  output: {
    file: './example/bundle.js',
    format: 'umd',
  },
  plugins: [
    alias({
      resolve: ['.html'],
      [`${PKG.name}`]: fromWorkspace(),
    }),
    /** Virtual entry module to bootstrap the example app */
    virtual({
      __entry__: `
      import '${posixify('@mamba/pos/simulator/index.js')}';
      import App from '${posixify(fromWorkspace('example', 'Example.html'))}'
        new App({ target: document.getElementById('root') })`,
    }),
    nodeResolve({
      extensions: ['.js', '.svelte', '.html'],
    }),
    cjs(),
    /** Compile svepte components and extract it's css to <workspaceDir>/example/style.css */
    svelte(svelteConfig),
    babel({
      /** Enforce usage of '.babelrc.js' at the project's root directory */
      babelrc: false,
      ...babelConfig,
      externalHelpers: true,
      runtimeHelpers: true,
      exclude: /node_modules[/\\](?!(svelte)|(@mamba))/,
    }),
    filesize(),
    image({
      limit: 10 * 1024, // inline files < 10k, copy files > 10k
      emitFiles: true, // defaults to true
      include: [
        fromWorkspace('**/*.{png,jpg,svg,bmp}'),
        fromProject('node_modules', '**', '*.{png,jpg,svg,bmp}'),
        fromProject('**', 'node_modules', '**', '*.{png,jpg,svg,bmp}'),
      ],
    }),
    replace({
      __NODE_ENV__: JSON.stringify(process.env.NODE_ENV),
      __APP_ENV__: JSON.stringify(process.env.APP_ENV),
      __PROD__: process.env.NODE_ENV === 'production',
      __TEST__: process.env.NODE_ENV === 'test',
      __DEV__: process.env.NODE_ENV === 'development',
      __POS__: process.env.APP_ENV === 'POS',
      __SIMULATOR__: process.env.MAMBA_SIMULATOR === true,
      __BROWSER__: process.env.APP_ENV === 'browser',
      __DEBUG_LVL__: 2,
    }),
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
          .filter((v, i, a) => a.indexOf(v) === i)
          .map(dep => fromWorkspace('node_modules', dep)),
      ],
    }),
    /** Reload the serve on file changes */
    livereload(),
  ],
};
