import { basename, dirname } from 'path';
import { getPkg, IS_WATCHING } from 'quickenv';

const PKG = getPkg();

export default function ({
  /** Input file relative path */
  input = PKG.source || 'src/index.js',
  /** Output file relative path */
  output = PKG.main,
  format = 'cjs',
  ...rest
} = {}) {
  /** Output filename */
  const filename = basename(output);

  /** Output directory path */
  const path = dirname(output);

  /** Module global variable name */
  const name = filename
    .replace(/\.[^/.]+$/, '')
    .replace(/\b\w/g, l => l.toUpperCase());

  /** Rollup output property */
  output = {
    dir: path,
    /** Path to the output file */
    file: output,
    dest: output,
    filename,
    name,
    format,
    exports: 'named',
  };

  if (IS_WATCHING()) {
    rest.watch = {
      chokidar: false,
    };
  }

  return {
    input,
    output,
    ...rest,
  };
}
