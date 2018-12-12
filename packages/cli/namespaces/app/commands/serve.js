const shell = require('../../../lib/shell.js');

/** Build the app for a specific environment */
module.exports = {
  command: 'serve',
  desc: 'Start a local http server to deploy the app through the Develop app',
  handler() {
    shell('http-server "dist/" --cors="*"');
  },
};
