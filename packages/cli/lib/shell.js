const shelljs = require('shelljs');
const shellEscape = require('shell-escape-tag');

const GLOBAL_OPTIONS = {
  /**
   * @param {boolean} async Asynchronous execution. If a callback is provided, it will be set to true, regardless of the passed value (default: false).
   * @default false
   */
  async: false,

  /**
   * @param {boolean} fatal Exit upon error (default: true).
   * @default true
   */
  fatal: true,

  /**
   * @param {boolean} silent Do not echo program output to console (default: false).
   * @default false
   */
  silent: false,

  /**
   * @param {string} encoding Character encoding to use. Affects the values returned to stdout and stderr, and what is written to stdout and stderr when not in silent mode (default: 'utf8').
   * @default 'utf8'
   */
  encoding: 'utf8',
};

/**
 *
 * @param {*} cmd
 * @param {GLOBAL_OPTIONS} opts
 * @returns
 */
const shell = (cmd, opts = {}) => {
  const { fatal } = opts;

  opts = {
    ...GLOBAL_OPTIONS,
    cwd: process.cwd(),
    env: { ...process.env, FORCE_COLOR: 2 },
    ...opts,
  };

  try {
    if (Array.isArray(cmd)) {
      cmd = cmd.join(' ');
    }

    const escaped = String(shellEscape.preserve`${cmd}`).trimStart();

    if (process.env.DEBUG_LVL >= 1) {
      console.info(escaped);
    }

    const run = shelljs.exec(cmd, opts);
    if (fatal && run.code !== 0) {
      throw new Error(run.stderr);
    }

    return 0;
  } catch (error) {
    if (fatal) {
      process.exit(1);
    }
    return 1;
  }
};

module.exports = shell;
