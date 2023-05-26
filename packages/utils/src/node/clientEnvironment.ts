/* eslint-disable @typescript-eslint/no-explicit-any */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { CLIENT_ENVIRONMENT_MODE } from './types';

export type ClientEnvModeType = keyof typeof CLIENT_ENVIRONMENT_MODE;

// Get cwd project environment variables with .env.js file
export default function clientEnvironment(mode: ClientEnvModeType = 'ESLint') {
  let externalConstants: Record<string, any> = {};
  const externalEnvsPath = join(process.cwd(), '.env.js');

  if (existsSync(externalEnvsPath)) {
    externalConstants = require(externalEnvsPath); // eslint-disable-line
    externalConstants = Object.keys(externalConstants).reduce(
      (accumulator: Record<string, unknown>, key) => {
        if (mode === 'ESLint') {
          accumulator[key] = 'readonly';
        } else {
          accumulator[key] = externalConstants[key];
        }

        return accumulator;
      },
      {},
    );
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
