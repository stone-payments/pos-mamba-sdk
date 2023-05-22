import { existsSync } from 'node:fs';
import path from 'node:path';

export enum CLIENT_ENVIRONMENT_MODE {
  ESLint = 'eslint',
  Webpack = 'webpack',
}

// Get cwd project environment variables with .env.js file
export default function clientEnvironment(mode = CLIENT_ENVIRONMENT_MODE.ESLint) {
  let externalConstants = {};
  const externalEnvsPath = path.join(process.cwd(), '.env.js');

  if (existsSync(externalEnvsPath)) {
    externalConstants = require(externalEnvsPath); // eslint-disable-line
    externalConstants = Object.keys(externalConstants).reduce((accumulator, key) => {
      if (mode === CLIENT_ENVIRONMENT_MODE.ESLint) {
        accumulator[key] = 'readonly';
      } else {
        accumulator[key] = externalConstants[key];
      }

      return accumulator;
    }, {});
  } else {
    // TODO: remove the env.js message and put in some documentation.
    // eslint-disable-next-line no-console
    // console.log(
    //   pico.yellow(
    //     pico.bold(
    //       '\n.env.js file not found. If you need add additional environment variables, \ncreate it based on http://github.com/stone-payments/pos-mamba-app-template/blob/master/.env.js',
    //     ),
    //   ),
    // );
  }

  return externalConstants;
}
