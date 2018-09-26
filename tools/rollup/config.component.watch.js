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
import { getPkg } from 'quickenv';

import posixify from './helpers/posixify.js';
import makeRollupConfig from './helpers/makeRollupConfig.js';
import copyStaticArtifacts from './helpers/copyStaticArtifacts.js';

const { fromWorkspace, fromProject } = require('../utils/paths.js');

const babelConfig = require('../../.babelrc.js');
const svelteConfig = require('../../svelte.config.js');

const PKG = getPkg();

const STATIC_ARTIFACTS = ['assets'];

/** Svelte component example build config */
const config = {
  /** Use the virtual module __entry__ as the input for rollup */
  input: '__entry__',
  output: 'example/bundle.js',
  format: 'umd',
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
    /** Compile svepte components and extract itls css to <workspaceDir>/example/style.css */
    svelte(svelteConfig),
    babel({
      /** Enforce usage of '.babelrc.js' at the project's root directory */
      babelrc: false,
      ...babelConfig,
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
          .filter((v, i, a) => a.indexOf(v) === i)
          .map(dep => fromWorkspace('node_modules', dep)),
      ],
    }),
    /** Reload the serve on file changes */
    livereload(),
    replace({
      __NODE_ENV__: JSON.stringify(process.env.NODE_ENV),
      __APP_ENV__: JSON.stringify(process.env.APP_ENV),
      __PROD__: process.env.NODE_ENV === 'production',
      __TEST__: process.env.NODE_ENV === 'test',
      __DEV__: process.env.NODE_ENV === 'development',
      __POS__: process.env.APP_ENV === 'POS',
      __SIMULATOR__: process.env.MAMBA_SIMULATOR === true,
      __BROWSER__: process.env.APP_ENV === 'browser',
    }),
  ],
};

export default makeRollupConfig(config);
