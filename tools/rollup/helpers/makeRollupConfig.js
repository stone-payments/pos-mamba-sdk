import { basename, dirname } from 'path'
import resolve from 'rollup-plugin-node-resolve'
import cjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import filesize from 'rollup-plugin-filesize'
import eslint from 'rollup-plugin-eslint'

const { PKG } = require('../consts.js')

/** Base rollup plugins */
const plugins = [
  resolve(),
  cjs(),
  eslint(),
  babel({
    exclude: 'node_modules/**',
    /** Enforce usage of '.babelrc.js' at the project's root directory */
    babelrc: false,
    ...require('../../.babelrc.js'),
  }),
  filesize(),
].filter(Boolean)

export default function({
  /** Input file relative path */
  input = PKG.source || 'src/index.js',
  /** Output file relative path */
  output = PKG.main,
  format = 'cjs',
} = {}) {
  /** Output filename */
  const filename = basename(output)

  /** Output directory path */
  const path = dirname(output)

  /** Module global variable name */
  const name = filename
    .replace(/\.[^/.]+$/, '')
    .replace(/\b\w/g, l => l.toUpperCase())

  /** Rollup output property */
  output = {
    dir: path,
    /** Path to the output file */
    file: output,
    dest: output,
    filename,
    name,
    /** Use commonjs2 for smaller bundle sizes. */
    format,
  }

  return {
    input,
    output,
    plugins,
  }
}
