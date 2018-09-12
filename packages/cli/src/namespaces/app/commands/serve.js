const childProcess = require('child_process');

/** Build the app for a specific environment */
module.exports = {
  command: 'serve',
  desc: 'Start a local http server to deploy the app through the Develop app',
  handler() {
    const cmd = 'http-server "dist/" --cors="*"';
    childProcess.execSync(cmd, { stdio: 'inherit' });
  },
};
