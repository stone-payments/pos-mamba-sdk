import { basename, dirname } from 'path';
import { getPkg, IS_WATCHING } from 'quickenv';

const PKG = getPkg();

export default function({
  /** Input file relative path */
  input,
  /** Output file relative path */
  output = PKG.main,
  format = 'cjs',
  ...rest
} = {}) {
  /**
   * If no input was defined, try to use the package.json's
   * 'build.source' if it's a string. Otherwise, default to 'src/index.js'
   * */
  if (!input) {
    input =
      PKG.build && typeof PKG.build.source === 'string'
        ? PKG.build.source
        : 'src/index.js';
  }
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
