const childProcess = require('child_process');
const { homedir } = require('os');
const { IS_WINDOWS } = require('./consts.js');

const shell = (cmd, opts = {}) => {
  opts = {
    exit: true,
    quiet: false,
    cwd: process.cwd(),
    ...opts,
  };

  const { exit, quiet } = opts;

  if (Array.isArray(cmd)) {
    cmd = cmd.filter(Boolean).join(IS_WINDOWS ? ' && ' : ';');
  }

  try {
    childProcess.execSync(cmd, {
      cwd: opts.cwd,
      stdio: [
        process.stdin,
        quiet ? null : process.stdout,
        quiet ? null : process.stderr,
      ],
    });
    return 0;
  } catch (error) {
    if (exit) {
      process.exit(1);
    }
    return 1;
  }
};

shell.cd = dir => {
  if (!dir) dir = homedir();

  if (dir === '-' && process.env.OLDPWD) {
    dir = process.env.OLDPWD;
  }

  try {
    const curDir = process.cwd();
    process.chdir(dir);
    process.env.OLDPWD = curDir;
  } catch (e) {
    // something went wrong, let's figure out the error
    console.error(`no such file or directory: ${dir}`);
  }
};

shell.rsync = (src, tgt, opts = {}) => {
  const cmd = ['rsync', '-zzaP', opts.checksum && '--checksum', src, tgt]
    .filter(Boolean)
    .join(' ');

  delete opts.checksum;

  return shell(cmd, opts);
};

module.exports = shell;
