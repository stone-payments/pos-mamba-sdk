const readline = require('readline');

const versionInput = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

module.exports = {
  command: 'build',
  desc: 'Build MambaOS using the flags release (-r) or debug (-d)',
  builder: {
    debug: {
      description: 'Build for debug propose, logs are enabled.',
      default: true,
      alias: ['d'],
    },
    release: {
      description: 'Build for release propose, logs are disabled.',
      default: false,
      alias: ['r'],
    },
  },
  handler({
    debug,
    release,
  }) {
    versionInput.question('Please, type your system version [x.x.x]:', (answer) => {
      // check typed string
      if (answer.matches(/\d\.\d\.\d/)) {
        if (release) {
          console.log('Bulding for release');
        } else {
          console.log('Building for production', debug);
        }
        console.log('Mamba OS Build Done!');
      } else {
        console.log('Build Failed: INVALID VERSION');
      }
    });
  },
};
