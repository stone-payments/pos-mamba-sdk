const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Get cwd project environment variables with .env.js file
let externalConstants = {};
const externalEnvsPath = path.join(process.cwd(), '.env.js');

if (fs.existsSync(externalEnvsPath)) {
  externalConstants = require(externalEnvsPath); // eslint-disable-line
} else {
  console.log(
    chalk.yellow.bold(
      '\n.env.js file not found. If you need add additional environment variables, create it based on http://github.com/stone-payments/pos-mamba-app-template/blob/master/.env.js',
    ),
  );
}

module.exports = externalConstants;
